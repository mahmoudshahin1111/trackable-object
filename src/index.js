function TrackableObject(obj, config) {
  let basePropertyPath = config?.propertyPath;
  let changes = config?.changes;
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

      if (pathProperties.length > 1) {
        const lastProperty = pathProperties[pathProperties.length - 1];

        propertyValue = getObjPropertyByPath(
          _obj,
          pathProperties.slice(0, pathProperties.length - 1).join(".")
        );

        Object.defineProperty(propertyValue, lastProperty, {
          get() {
            return value;
          },
          set(v) {
          
            const oldValue = getObjPropertyByPath(_objShadow, propertyPath);
            const fullPropertyPath = basePropertyPath? `${basePropertyPath}.${propertyPath}`:propertyPath;
            if (oldValue === v) {
              changes.delete(fullPropertyPath);
            } else {
            
              changes.set(fullPropertyPath, JSON.parse(JSON.stringify(v)));
            }
            const clonedValue = JSON.parse(JSON.stringify(v));
            if (typeof clonedValue === "object") {
              value = TrackableObject(clonedValue, { changes,propertyPath:fullPropertyPath });
            } else {
              value = clonedValue;
            }
          },
        });
      } else {
        Object.defineProperty(_obj, propertyPath, {
          get() {
            return value;
          },
          set(v) {
          
            const oldValue = getObjPropertyByPath(_objShadow, propertyPath);
            const fullPropertyPath = basePropertyPath? `${basePropertyPath}.${propertyPath}`:propertyPath;
            if (oldValue === v) {
              changes.delete(fullPropertyPath);
            } else {
              changes.set(fullPropertyPath, JSON.parse(JSON.stringify(v)));
            }
            const clonedValue = JSON.parse(JSON.stringify(v));
            if (typeof clonedValue === "object") {
              value = TrackableObject(clonedValue, { changes,propertyPath:fullPropertyPath });
            } else {
              value = clonedValue;
            }
          },
        });
      }
    }
  }

  overrideSetterAndGetter(obj);

  obj.t_changes = () => changes;
  
  return obj;
}

const person = {
  name: "person 1",
  child: {
    name: "child 1",
    mom: {
      name: "lil",
    },
  },
};

const trackablePerson = TrackableObject(person);

trackablePerson.name = "person 2";
trackablePerson.child.name = "child 2";
trackablePerson.child.name = "child 1";
trackablePerson.child.name = "child 3";
trackablePerson.child.mom.name = {
  prevName:'name 1',
  nextName:'name 2'
}

trackablePerson.child.mom.name.prevName = 'name 3';
// trackablePerson.name = "test 1";
// trackablePerson.child = { name: "child 1 updated" };
setTimeout(() => {
  //   trackablePerson.child.name = "child 2 updated";
  console.log(
    trackablePerson.t_changes(),
  );
}, 1000);
