import * as fs from "node:fs";
import path from "node:path";
import { corpus } from "@/i18n/corpus";
import { Translate } from "@aws-sdk/client-translate";
import { getAwsCredentials } from "@tendrel/lib";
import type { SupportedLanguage } from "@tendrel/sdk";

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

export type Translation = {
  t: string;
  override: boolean;
};

export type Translations = {
  [key: string]: Translation | Translations;
};

export type NestedTranslation = {
  [key: string]: string | NestedTranslation;
};

const translationClient: Translate = new Translate({
  credentials: getAwsCredentials(),
});

async function translateText(
  text: string,
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage,
): Promise<string | undefined> {
  const translatedText = (
    await translationClient.translateText({
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage,
      Text: text,
    })
  ).TranslatedText;
  return translatedText;
}

async function translateObject(
  obj: NestedTranslation,
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage,
  existing: Translations,
  force: boolean,
  flatTranslations: Translations,
): Promise<Translations> {
  const translatedObj: Translations = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      // Ensure existing[key] is an object or create an empty one
      translatedObj[key] = await translateObject(
        obj[key] as NestedTranslation,
        sourceLanguage,
        targetLanguage,
        (existing[key] as Translations) || {}, // Provide an empty object if existing[key] is undefined
        force,
        flatTranslations,
      );
    } else {
      const existingTranslation = existing[key] as Translation | undefined;
      const override = existingTranslation?.override ?? false;
      let translation = existingTranslation?.t;

      if (override) {
        console.log(`Skipping ${key} -> ${translation} due to override`);
        translatedObj[key] = { t: translation ?? "", override: true };
        flatTranslations[key] = {
          t: translation ?? "",
          override: true,
        };
      } else {
        if (!translation || force) {
          translation = await translateText(
            obj[key] as string,
            sourceLanguage,
            targetLanguage,
          );
          console.log(`Translated ${obj[key]} to ${translation}`);
        }
        translatedObj[key] = { t: translation ?? "", override: false };
        flatTranslations[key] = {
          t: translation ?? "",
          override: false,
        };
      }
    }
  }

  return translatedObj;
}

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
  const filePath = path.resolve(
    __dirname,
    `../i18n/locales/${targetLanguage}.json`,
  );

  let existing: Translations = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const flatTranslations: Translations = {};
  const translations: Translations = await translateObject(
    corpus,
    sourceLanguage,
    targetLanguage,
    existing,
    force,
    flatTranslations,
  );

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
