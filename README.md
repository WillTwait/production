# Welcome to your Tendrel app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   bun i
   ```

2. Start the app

   ```bash
    bun ios
   # or bun android
   ```

## Testing
[Install Maestro](https://maestro.mobile.dev/getting-started/installing-maestro)

After adding flows to the `test` directory, run them with
```bash
maestro test test/
```

## Troubleshooting

If your simulator can't connect to the dev server, make sure you are using the node version specified in
`.nvmrc`. You can ensure consistency by [installing nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and 
running

```bash
nvm use
```
