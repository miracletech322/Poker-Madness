import Global from "./Global";
import en from "./i18n/en";

export type Language = "en";
export type Translations = { [key: string]: string };

let currentLang: Language = "en";

const replacePlaceholders = (
  text: string,
  params: { [key: string]: string | number }
): string => {
  return text.replace(
    /{{(.*?)}}/g,
    (_, key) => params[key.trim()]?.toString() || ""
  );
};

export function T(
  key: string,
  params: { [key: string]: string | number } = {}
): string {
  const translation = Global.instance.i18n[currentLang][key] || key;
  return replacePlaceholders(translation, params);
}

export function setLanguage(lang: Language): void {
  currentLang = lang;
}

export function loadI18n() {
  Global.instance.i18n = { en };
}
