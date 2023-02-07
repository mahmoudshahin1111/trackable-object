const { SHADOW_OBJECT_KEY } = require("./common");
const { TrackableObject } = require("./trackable-object");
require("jest");

describe("TrackableObject", () => {
  let person = null;
  beforeEach(() => {
    person = {
      name: "person 1",
      child: {
        name: "child 1",
        mom: {
          name: "lil",
        },
      },
    };
  });
  it("should save any change happen on the object properties", () => {
    const trackablePerson = TrackableObject(person);
    // change the values
    trackablePerson.name = "person 2";
    trackablePerson.child.name = "child 2";
    trackablePerson.child.name = "child 1";
    trackablePerson.child.name = "child 3";
    trackablePerson.child.mom.name = {
      prevName: "name 1",
      nextName: "name 2",
    };
    trackablePerson.child.mom.name.prevName = "name 3";
    // expect it tracked the changes.
    expect(trackablePerson.t_changes().size).toBe(4);
  });

  it("should the shadow object be defined", () => {
    const trackablePerson = TrackableObject(person);
    const shadowObject = trackablePerson[SHADOW_OBJECT_KEY];
    expect(shadowObject).toBeDefined();
  });

  it("should clear that property has an absolute value if it didn't changed", () => {
    const trackablePerson = TrackableObject(person);
    trackablePerson.child.name = "child 2";
    trackablePerson.child.name = "child 3";
    trackablePerson.child.name = "child 1";
    // expect it tracked the changes.
    expect(trackablePerson.t_changes().size).toBe(0);
  });

  it("should trace that property has an object value", () => {
    const trackablePerson = TrackableObject(person);
    trackablePerson.child = { name: "child 4" };
    // expect it tracked the changes.
    expect(trackablePerson.t_changes().get("child")).toEqual({ name: "child 4" });
  });

  it("should clear that property has an object value if it didn't changed", () => {
    const trackablePerson = TrackableObject(person);
    const oldObject =  trackablePerson.child;
    trackablePerson.child = { name: "child 4" };
    trackablePerson.child = oldObject;
    // expect it tracked the changes.
    expect(trackablePerson.t_changes().size).toBe(0);
  });

  
});
