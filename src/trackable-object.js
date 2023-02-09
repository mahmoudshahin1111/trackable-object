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

  const _objShadow = cloneDeep(obj);
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
    let value = cloneDeep(propertyValue);
    const pathProperties = String(propertyPath).split(".");

    let setter = (newValue) => {
      const currentValue = getObjPropertyByPath(_objShadow, propertyPath);

      const fullPropertyPath = basePropertyPath
        ? `${basePropertyPath}.${propertyPath}`
        : propertyPath;

      if (isEquals(currentValue, newValue)) {
        removeObjectChanges(changes, fullPropertyPath);
      } else {
        changes.set(fullPropertyPath, cloneDeep(newValue));
      }
      const clonedValue = cloneDeep(newValue);
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
    const lastProperty = pathProperties[pathProperties.length - 1];
    if (typeof propertyValue === "object") {
      Object.defineProperty(_obj, lastProperty, {
        get: getter,
        set: setter,
      });
      Object.keys(propertyValue).forEach((_key) => {
        overrideSetterAndGetter(
          _obj,
          propertyPath ? `${propertyPath}.${_key}` : _key
        );
      });
    } else {
      if (pathProperties.length > 1) {
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

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isEquals(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * remove the object keys and it's sub properties keys if exists
 * @param {Map<string,any>} changes
 * @param {string} objPath
 * @returns {Map<string,any>}
 */
function removeObjectChanges(changes, objPath) {
  for (const changedKey of changes.keys()) {
    if (
      new RegExp(`${objPath}\.*`).test(changedKey) ||
      changedKey === objPath
    ) {
      changes.delete(changedKey);
    }
  }

  return changes;
}

module.exports = {
  TrackableObject,
};
