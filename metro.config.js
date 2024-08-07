const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");
/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

const localSdkPath = path.resolve(__dirname, "../sdk");
const extraNodeModules = {
  "@tendrel/sdk": localSdkPath,
};

config.resolver.sourceExts.push("sql");

config.resolver.extraNodeModules = {
  "@tendrel/sdk": localSdkPath,
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
  get: (target, name) =>
    // redirects dependencies referenced from myExtraModule/ to local node_modules
    name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
});
config.resetCache = true;
config.watchFolders = [localSdkPath];
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
