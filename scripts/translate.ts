import * as fs from "fs";

import { Translate } from "@aws-sdk/client-translate";
import { getAwsCredentials } from "@tendrel/lib";

import path from "node:path";
import { corpus } from "@/i18n/corpus.json";
import { SupportedLanguage } from "@tendrel/sdk";

// reference list here: https://www.notion.so/tendrel/fe11a39036a347638dd99ae54d037ffa?v=5e3dc845512945ae904478a272f3219d
const SelfServiceLanguages: SupportedLanguage[] = [
  "ar",
  "bn",
  "zh",
  "nl",
  "en",
  "fr",
  "de",
  "el",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "pl",
  "pt",
  "ro",
  "ru",
  "sr",
  "sk",
  "sl",
  "es",
  "es-MX",
  "tr",
  "uk",
  "ur",
  "vi",
];

export type Translations = {
  [key: string]: { t: string; override: boolean };
};

const translationClient: Translate = new Translate({ credentials: getAwsCredentials() });

/**
 * @param sourceLanguage The language to translate from
 * @param targetLanguage The language to translate to
 * @param force Whether to force a full re-translation (while still skipping overrides)
 */
async function generateTranslationFile(
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage,
  force: boolean,
): Promise<void> {
  const filePath = path.resolve(__dirname, `../i18n/locales/${targetLanguage}.json`);

  let existing: Translations = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const translations: Translations = {};
  if (sourceLanguage === targetLanguage) {
    Object.keys(corpus).forEach(key => {
      const existingTranslation = existing[key];
      const override = existingTranslation?.override ?? false;

      translations[key] = {
        t: override ? existingTranslation?.t ?? "" : corpus[key as keyof typeof corpus],
        override: override,
      };
    });
  } else {
    for (const [key, value] of Object.entries(corpus)) {
      const existingValue = existing[key];

      let translation = existingValue?.t;
      const override = existingValue?.override;

      if (override) {
        console.log(`Skipping ${key} -> ${translation} due to override`);
        translations[key] = {
          t: translation ?? "",
          override: true,
        };
        continue;
      }
      if (!translation || force) {
        translation =
          (
            await translationClient.translateText({
              SourceLanguageCode: sourceLanguage,
              TargetLanguageCode: targetLanguage,
              Text: value as string,
            })
          ).TranslatedText ?? "undefined";
        console.log(`Translated ${value} to ${translation}`);
      }

      translations[key] = {
        t: translation ?? "",
        override: false,
      };
    }
  }

  fs.writeFile(filePath, JSON.stringify(translations, null, 2), err => {
    if (err) {
      console.log(err);
    }
  });
}

async function main() {
  const force = process.argv[2];
  for (const lang of SelfServiceLanguages) {
    await generateTranslationFile("en", lang, !!force);
    console.log("Finished translating: ", lang);
  }
}

main();
