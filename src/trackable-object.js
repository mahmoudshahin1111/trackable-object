const { TRACKABLE_PREFIX, SHADOW_OBJECT_KEY } = require("./common");

function createShadowObject(config) {
  const shadowObject = {};
  shadowObject.propertyPath = config?.propertyPath;
  shadowObject.changes = config?.changes;
  if (!shadowObject.changes) {
    shadowObject.changes = new Map();
  }
  return shadowObject;
}

function TrackableObject(obj, config) {
  const shadowObject = createShadowObject(config);

  let basePropertyPath = shadowObject.propertyPath;
  let changes = shadowObject.changes;

  const _objShadow = JSON.parse(JSON.stringify(obj));
  function getObjPropertyByPath(_obj, propertyPath) {
    let propertyValue = _obj;
    String(propertyPath)
      .split(".")
      .forEach((property) => {
        if (!propertyValue[property]) {
          propertyValue = null;
          return false;
        }
        propertyValue = propertyValue[property];
      });
    return propertyValue;
  }
  function overrideSetterAndGetter(_obj, propertyPath) {
    let propertyValue = _obj;
    if (propertyPath) {
      propertyValue = getObjPropertyByPath(_obj, propertyPath);
    }
    let value = JSON.parse(JSON.stringify(propertyValue));
    const pathProperties = String(propertyPath).split(".");

    let setter = (newValue) => {
      const currentValue = getObjPropertyByPath(_objShadow, propertyPath);
      const fullPropertyPath = basePropertyPath
        ? `${basePropertyPath}.${propertyPath}`
        : propertyPath;
      if (currentValue === newValue) {
        changes.delete(fullPropertyPath);
      } else {
        changes.set(fullPropertyPath, JSON.parse(JSON.stringify(newValue)));
      }
      const clonedValue = JSON.parse(JSON.stringify(newValue));
      if (typeof clonedValue === "object") {
        value = TrackableObject(clonedValue, {
          changes,
          propertyPath: fullPropertyPath,
        });
      } else {
        value = clonedValue;
      }
    };

    let getter = () => {
      return value;
    };
    if (typeof propertyValue === "object") {
      Object.keys(propertyValue).forEach((_key) => {
        overrideSetterAndGetter(
          _obj,
          propertyPath ? `${propertyPath}.${_key}` : _key
        );
      });
    } else {
      if (pathProperties.length > 1) {
        const lastProperty = pathProperties[pathProperties.length - 1];

        propertyValue = getObjPropertyByPath(
          _obj,
          pathProperties.slice(0, pathProperties.length - 1).join(".")
        );

        Object.defineProperty(propertyValue, lastProperty, {
          get: getter,
          set: setter,
        });
      } else {
        Object.defineProperty(_obj, propertyPath, {
          get: getter,
          set: setter,
        });
      }
    }
  }

  function defineShadowObject(_obj) {
    Object.defineProperty(_obj, SHADOW_OBJECT_KEY, {
      value: () => shadowObject,
      writable: false,
      enumerable: false,
    });
    Object.defineProperty(_obj, `${TRACKABLE_PREFIX}changes`, {
      value: () => shadowObject.changes,
      writable: false,
      enumerable: false,
    });
  }

  overrideSetterAndGetter(obj);
  defineShadowObject(obj);

  return obj;
}

module.exports = {
  TrackableObject,
};
