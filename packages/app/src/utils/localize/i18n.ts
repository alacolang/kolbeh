import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fa from "./fa.json";

const resources = {
  fa: {
    translation: fa,
  },
  en: {
    hello: "Hello",
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "fa",
    // keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: false,
  });

export default i18n;
