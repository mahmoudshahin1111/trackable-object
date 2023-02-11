const path = require("path");
module.exports = [
  {
    entry: "./src/index.js",
    mode: "production",
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "trackable-object.js",
      library: "TrackableObject",
    },
  },
  {
    entry: "./src/index.js",
    mode: "production",
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      library: "TrackableObject",
    },
  },
];
