// {
//   "artifactDirectory": "./__generated__",
//   "src": ".",
//   "schema": "./node_modules/@tendrelhq/graphql/schema.graphql",
//   "language": "typescript"
// }

const path = require("node:path");

module.exports = {
  artifactDirectory: path.resolve(__dirname, "__generated__"),
  src: path.resolve(__dirname, "."), // or specify 'src' if that's your source directory
  schema: path.resolve(
    __dirname,
    "node_modules",
    "@tendrelhq",
    "graphql",
    "schema.graphql",
  ),
  language: "typescript",
};
