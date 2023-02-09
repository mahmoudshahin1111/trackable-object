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
    console.log(trackablePerson);
    trackablePerson.child = { name: "child 4" };
    // expect it tracked the changes.
    expect(trackablePerson.t_changes().get("child")).toEqual({
      name: "child 4",
    });
  });

  it("should clear that property has an object value if it didn't changed", () => {
    const trackablePerson = TrackableObject(person);
    const oldObject = trackablePerson.child;
    trackablePerson.child = { name: "child 4" };
    trackablePerson.child = oldObject;
    console.log(trackablePerson.t_changes());
    // expect it tracked the changes.
    expect(trackablePerson.child).toEqual(oldObject);
    expect(trackablePerson.t_changes().size).toBe(0);
  });

  it("should the changes keys to be equals the property path", () => {
    const trackablePerson = TrackableObject(person);
    trackablePerson.child = { name: "child 4" };
    // expect the changes property to be on properly format
    expect(trackablePerson.t_changes().has("child")).toBe(true);
    trackablePerson.child.name = "child 101";
    expect(trackablePerson.t_changes().has("child.name")).toBe(true);
  });

  it("should remove the changes and all the linked changes for same object if it's new value was the same ", () => {
    const trackablePerson = TrackableObject(person);
    trackablePerson.name = "person_name_updated_1";
    trackablePerson.name = {
      firstName: "person_name_first_name",
      lastName: "person_name_last_name",
    };
    trackablePerson.name.firstName = "person_name_first_name_updated_1";

    trackablePerson.name = "person 1";

    expect(trackablePerson.t_changes().has("name.firstName")).toBe(false);
  });
});
