const changes = new Map();
function TrackableObjectOf(obj) {
  obj["_changes"] = new Map();
  convertPropertyToShadowObj(obj);
  return obj;
}

function convertPropertyToShadowObj(obj, propertyKey = null) {
  if (propertyKey === null && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      obj[key] = convertPropertyToShadowObj(obj, key);
    });
  } else if (propertyKey && typeof obj[propertyKey] === "object") {
    Object.keys(obj[propertyKey]).forEach((key) => {
      obj[key] = convertPropertyToShadowObj(obj[propertyKey], key);
    });
  } else {
    ShadowObjectOf(obj, propertyKey);
  }
}

function ShadowObjectOf(obj, propertyKey) {
  const key = Math.round(Math.random() * 10000).toString();
  Object.defineProperty(obj, "_trackable_obj", { value: {} });
  Object.defineProperty(obj["_trackable_obj"], "key", { value: key });
  Object.defineProperty(obj["_trackable_obj"], "value", {
    value: obj[propertyKey],
  });
  console.log(obj,propertyKey,obj[propertyKey]);
  Object.defineProperty(obj, propertyKey, {
    get: () => {
      return obj["_trackable_obj"].value;
    },
    set: (v) => {
      obj["_trackable_obj"].value = v;
      changes.set(propertyKey, v);
    },
  });
  return obj;
}

const person = {
  name: "test",
  child: {
    name: "child 1",
  },
};

const trackablePerson = new TrackableObjectOf(person);
trackablePerson.name = "test 1";
trackablePerson.child.name = "child 1";
console.log(trackablePerson.name, changes, trackablePerson.changes);
