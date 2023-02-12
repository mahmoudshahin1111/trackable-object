const path = require("path");
module.exports = [
  {
    entry: "./index.js",
    mode: "production",
    target: "web",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "trackable-object.js",
      library: "TrackableObject",
    },
  },
  {
    entry: "./index.js",
    mode: "production",
    target: "node",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "index.js",
    },
  },
];
