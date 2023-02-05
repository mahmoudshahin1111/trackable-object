const { TrackableObject } = require("./trackable-object");
require("jest");

describe("TrackableObject", () => {
  it("should save any change happen on the object properties", () => {
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
      prevName: "name 1",
      nextName: "name 2",
    };

    trackablePerson.child.mom.name.prevName = "name 3";
    expect(trackablePerson.t_changes().size).toBe(4);
  });
});
