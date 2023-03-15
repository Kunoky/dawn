import { createI18n } from 'vue-i18n'
import messages from '@/locales/zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN', // 设置语言环境
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': messages,
  }, // 设置语言环境信息
})

const loadedLanguages = ['zh-CN'] // 我们的预装默认语言

function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang) {
  // 如果语言相同或如果语言已经加载
  if (i18n.locale === lang || loadedLanguages.includes(lang)) {
    return setI18nLanguage(lang)
  }
  // 如果尚未加载语言
  const messages = await import(`@/locales/${lang}.js`)
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}
