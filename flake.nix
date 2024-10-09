{
  inputs = {
    android-nixpkgs.url = "github:tadfisher/android-nixpkgs/516bd59";
    devenv.url = "github:cachix/devenv";
    git-hooks.url = "github:cachix/git-hooks.nix";
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

    devenv.inputs.pre-commit-hooks.follows = "git-hooks";
  };

  nixConfig = {
    extra-substituters = [
      "https://tendrelhq.cachix.org"
    ];
    extra-trusted-public-keys = [
      "tendrelhq.cachix.org-1:uAnm9wwXD60bKJbPuDgpVMxcAje1IqhKoroTi4iX608="
    ];
  };

  outputs = {flake-parts, ...} @ inputs:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems = ["x86_64-linux"];
      perSystem = {
        config,
        lib,
        inputs',
        self',
        system,
        ...
      }: let
        pkgs = import inputs.nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
            android_sdk.accept_license = true;
          };
        };
      in {
        _module.args.pkgs = pkgs;

        devenv.shells.default = let
          pkg = lib.importJSON ./package.json;
          biome = pkgs.stdenv.mkDerivation rec {
            pname = "biome";
            version = let
              v = pkg.devDependencies."@biomejs/biome";
            in "v${lib.strings.removePrefix "^" v}";

            src = pkgs.fetchurl {
              url = "https://github.com/biomejs/biome/releases/download/cli%2F${version}/biome-linux-x64";
              hash = "sha256-4Xuz0V/Bkqp2eudpEwL0/SOegM6qzkwyOIV7naD0OQI=";
            };

            nativeBuildInputs = [pkgs.autoPatchelfHook];
            buildInputs = [pkgs.stdenv.cc.cc.libgcc];

            dontUnpack = true;
            installPhase = ''
              install -D -m755 $src $out/bin/biome
            '';

            meta.mainProgram = "biome";
          };
        in {
          name = "tendrel-console";
          containers = lib.mkForce {};
          env = {
            ANDROID_AVD_HOME = ".android/avd";
            BIOME_BINARY = lib.getExe biome;
            GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${config.packages.android-sdk}/share/android-sdk/build-tools/34.0.0/aapt2";
          };
          packages = with pkgs; [
            config.packages.android-emulator
            config.packages.android-sdk
            biome
            bun
            gradle
            jdk17
            nodejs
            vscode
          ];
          pre-commit.hooks = {
            actionlint.enable = true;
            alejandra.enable = true;
            biome = {
              enable = true;
              entry = "biome check --write";
            };
          };
          processes = {
            app = {
              exec = "bun android";
              process-compose = {
                depends_on = {
                  emulator.condition = "process_healthy";
                  relay.condition = "process_log_ready";
                };
              };
            };
            emulator = {
              exec = "${config.packages.android-emulator}/bin/run-test-emulator";
              process-compose = {
                readiness_probe = {
                  exec = {
                    command = "adb -s emulator-5554 wait-for-device";
                  };
                };
              };
            };
            relay = {
              exec = "relay-compiler --watch";
              process-compose = {
                ready_log_line = "Compilation completed";
              };
            };
          };
        };

        packages = {
          inherit (config.devenv.shells) default;

          android-sdk = inputs.android-nixpkgs.sdk."${system}" (sdk-pkgs:
            with sdk-pkgs; [
              build-tools-34-0-0
              cmake-3-22-1
              cmdline-tools-latest
              emulator
              platform-tools
              platforms-android-34
              ndk-25-1-8937393
              ndk-26-1-10909125

              # Other useful packages for a development environment.
              # sources-android-33
              system-images-android-34-default-x86-64
              # system-images-android-34-google-apis-x86-64
              # system-images-android-32-google-apis-playstore-x86-64
            ]);

          android-emulator = pkgs.writeShellApplication {
            name = "run-test-emulator";
            runtimeInputs = [config.packages.android-sdk];
            text = ''
              mkdir -p "$ANDROID_AVD_HOME"

              echo "Looking for a free TCP port in range 5554-5584" >&2
              for i in $(seq 5554 2 5584)
              do
                  if ! adb devices | grep -q "emulator-$i"
                  then
                      port=$i
                      break
                  fi
              done

              if [ -z "$port" ]
              then
                  echo "Unfortunately, the emulator port space is exhausted!" >&2
                  exit 1
              else
                  echo "We have a free TCP port: $port" >&2
              fi

              export ANDROID_SERIAL="emulator-$port"
              if ! avdmanager list avd | grep -q 'Name: device'
              then
                  # Create a virtual android device
                  yes "" | avdmanager create avd --force -n device -k "system-images;android-34;default;x86_64" -p "$ANDROID_AVD_HOME"/device.avd || true

              ${builtins.concatStringsSep "\n" (
                lib.mapAttrsToList (configKey: configValue: ''
                  echo "${configKey} = ${configValue}" >> "$ANDROID_AVD_HOME"/device.avd/config.ini
                '') {
                  "hw.gpu.enabled" = "yes";
                  "hw.keyboard" = "yes";
                }
              )}
              fi

              emulator -avd device -no-boot-anim -port "$port"
            '';
          };
        };
      };
    };
}
