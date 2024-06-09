import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18n
  .use(resourcesToBackend((language: any) => import(`locales/${language}/${language}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en"
  });

i18n.services.formatter?.add("firstUppercase", (value, lng, options) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
});
i18n.services.formatter?.add("lowercase", (value, lng, options) => {
  return value.toLowerCase();
});
i18n.services.formatter?.add("uppercase", (value, lng, options) => {
  return value.toUpperCase();
});
i18n.services.formatter?.add("underscore", (value, lng, options) => {
  return value.replace(/\s+/g, "_");
});
