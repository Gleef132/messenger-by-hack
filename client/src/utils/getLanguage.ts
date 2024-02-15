import { ILanguageData } from "@/models/ILanguage";
import { getCookie } from "./getCookie";
import { languages } from "@/lib/languages";

export const getLanguage = ():ILanguageData => {
  const language = getCookie('language')
  const defalutLanguage = 'en'
  if(language){
    return languages[language]
  }
  return languages[defalutLanguage]
}