import { $ } from "bun";

import * as process from "node:process";
import { parseArgs } from "node:util";
import { z } from "zod";

const { values } = parseArgs({
  args: Bun.argv,

  options: {
    commitHash: {
      type: "string",
    },
    platform: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const ExpoBuild = z.object({
  artifacts: z.object({
    buildUrl: z.string().url().optional(),
  }),
  completedAt: z.coerce.date().optional(),
  status: z.string(),
  distribution: z.string(),
});

const ExpoBuilds = z.array(ExpoBuild);

const Env = z
  .object({
    DCD_API_KEY: z.string(),
    EXPO_TOKEN: z.string(),
    PASSWORD: z.string(),
  })
  .parse(process.env);

const { platform, commitHash } = values;

if (!platform) {
  throw new Error("Please provide a valid platform (iOS | Android).");
}

if (!commitHash) {
  throw new Error("Please provide a commit hash.");
}

const { DCD_API_KEY, PASSWORD, EXPO_TOKEN } = Env;

let buildUrl = "";
const easOutput =
  await $`EXPO_TOKEN=${EXPO_TOKEN} eas build:list --json --non-interactive --platform ${platform.toLowerCase()} --status=finished --channel test --limit 1`;

const builds = ExpoBuilds.parse(JSON.parse(easOutput.stdout.toString())).filter(
  b => b.distribution === "INTERNAL" || b.distribution === "SIMULATOR",
);

const build = builds[0];

buildUrl = build.artifacts?.buildUrl ?? "";

if (!buildUrl) {
  await $`echo Failed to find a build!`;
  process.exit(1);
}

let fileName = `checklist.${platform === "iOS" ? "tar.gz" : "apk"}`;
await $`curl ${buildUrl} -L -o ${fileName}`;

// Expo gives us iOS simulator builds as .tar.gz files
if (platform === "iOS") {
  await $`tar xzvf ${fileName}`;
  fileName = "Checklist.app";
}

const os = platform === "iOS" ? "--ios-version=16" : "--android-api-level=33";

await $`dcd cloud --apiKey ${DCD_API_KEY} --app-file ${fileName} --flows ./test/flows/ -e MAESTRO_USERNAME=username1 -e MAESTRO_PASSWORD=${PASSWORD} -e CI=true ${os} --name checklist:${platform}:${commitHash}`;
