const { TRACKABLE_PREFIX } = require("./common");

function TrackableObject(obj, config) {
  function Config(config) {
    this.propertyPath = config?.propertyPath;
    this.changes = config?.changes;
  }
  const trackableObjectConfig = new Config(config);
  let basePropertyPath = trackableObjectConfig.propertyPath;
  let changes = trackableObjectConfig.changes;
  if (!changes) {
    changes = new Map();
  }

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

    if (typeof propertyValue === "object") {
      Object.keys(propertyValue).forEach((_key) => {
        overrideSetterAndGetter(
          _obj,
          propertyPath ? `${propertyPath}.${_key}` : _key
        );
      });
    } else {
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

  function defineTrackableProperties(_obj) {
    Object.defineProperty(_obj, `${TRACKABLE_PREFIX}changes`, {
      value: ()=>changes,
      writable: false,
      enumerable: false,
    });
  }

  overrideSetterAndGetter(obj);
  defineTrackableProperties(obj);

  return obj;
}

module.exports = {
  TrackableObject,
};
