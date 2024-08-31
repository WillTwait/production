import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

import {
  ar,
  bn,
  de,
  el,
  en,
  es,
  esMX,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ro,
  ru,
  sk,
  sl,
  sr,
  tr,
  uk,
  ur,
  vi,
  zh,
} from "@/i18n/locales/index";

export const resources = {
  ar: { translation: ar },
  bn: { translation: bn },
  zh: { translation: zh },
  nl: { translation: nl },
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  el: { translation: el },
  hi: { translation: hi },
  id: { translation: id },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  pl: { translation: pl },
  pt: { translation: pt },
  ro: { translation: ro },
  ru: { translation: ru },
  sr: { translation: sr },
  sk: { translation: sk },
  sl: { translation: sl },
  es: { translation: es },
  "es-MX": { translation: esMX },
  tr: { translation: tr },
  uk: { translation: uk },
  ur: { translation: ur },
  vi: { translation: vi },
} as const;

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async callback => {
    const storedLanguage = await AsyncStorage.getItem("@AppIntl:language");
    if (storedLanguage) {
      callback(storedLanguage);
      return storedLanguage;
    }

    // This is guaranteed to have at least one element
    const preferredLocale = Localization.getLocales()[0].languageTag;

    callback(preferredLocale);
    return Promise.resolve(preferredLocale);
  },
  init: () => {},
  cacheUserLanguage: async language => {
    await AsyncStorage.setItem("@AppIntl:language", language);
  },
} satisfies LanguageDetectorAsyncModule;

i18n.use(languageDetector).use(initReactI18next).init({
  resources,
  compatibilityJSON: "v3",
  fallbackLng: "en",
  debug: false,
});

export default i18n;
