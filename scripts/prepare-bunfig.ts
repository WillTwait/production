import { $ } from "bun";

const bunfigContent = `[install.scopes]
"@tendrel" = { token = \"${process.env.NPM_TOKEN}\", url = \"https://registry.npmjs.com/\" }`;

await $`echo "Creating bunfig.toml..."`;
await $`rm -f bunfig.toml`;
await $`echo ${bunfigContent} > bunfig.toml`;
await $`echo "Bunfig created. Running installation..."`;
await $`bun i`;
await $`echo "Installation complete."`;
