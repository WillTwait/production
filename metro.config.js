const path = require("node:path");
/** @type {import('expo/metro-config').MetroConfig} */

const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);

config.resolver.sourceExts.push("sql");

// Uncomment the following block to develop locally with the sdk
// const localSdkPath = path.resolve(__dirname, "../sdk");
// const extraNodeModules = {
//   "@tendrel/sdk": localSdkPath,
// };
//
// config.resolver.sourceExts.push("sql");
//
// config.resolver.extraNodeModules = {
//   "@tendrel/sdk": localSdkPath,
// };
//
// config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
//   get: (target, name) =>
//     // redirects dependencies referenced from myExtraModule/ to local node_modules
//     name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
// });
// config.resetCache = true;
// config.watchFolders = [localSdkPath];
// config.resolver.unstable_enableSymlinks = true;
// config.resolver.unstable_enablePackageExports = true;
// ** end of block **

module.exports = config;
