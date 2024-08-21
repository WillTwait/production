module.exports = api => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["relay", { artifactDirectory: "./__generated__" }],
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};
