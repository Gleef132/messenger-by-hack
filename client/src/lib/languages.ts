import { ILanguageData } from "@/models/ILanguage"

interface ILanguages{
  [key: string]: ILanguageData;
  en: ILanguageData;
  ru: ILanguageData;
}

export const languages:ILanguages = {
  en: {
    title: 'Messages',
    auth: {
      login: {
        text: 'Login',
        errorEmpty: 'Enter your username'
      },
      password: {
        text: 'Password',
        errorEmpty: 'Enter password'
      },
      loginButton: 'Login',
      registrButton: 'Registr'
    },
    search: {
      inputPlaceholder: 'Search',
      chats: 'Chats',
      global: 'Global Chats'
    },
    language: {
      text: 'Languages',
      english: 'English',
      russian: 'Русский'
    },
    theme: {
      text: 'Theme',
      light: 'Light',
      dark: 'Dark'
    },
    setting: {
      text: 'Settings'
    },
    userState: {
      lastSeen: 'last seen recently',
      offline: 'Offline',
      online: 'Online',
      typing: '... is typing'
    },
    chat: {
      file: 'File',
      photo: 'Photo',
      inputPlaceholder: 'Message',
      send: 'Send',
      sendFile: 'Send File',
      sendFiles: 'Send count Files',
      sendSmallAmountFiles: 'Send count Files',
      sendPhoto: 'Send Photo',
      sendPhotos: 'Send count Photos',
      sendMaxPhotos: 'max(4)',
      sendInputPlaceholder: 'Add a caption...'
    },
    userInfo: 'User Info'
  },
  ru: {
    title: 'Сообщения',
    auth: {
      login: {
        text: 'Логин',
        errorEmpty: 'Введите имя пользователя'
      },
      password: {
        text: 'Пароль',
        errorEmpty: 'Введите пароль'
      },
      loginButton: 'Вход',
      registrButton: 'Регистрация'
    },
    search: {
      inputPlaceholder: 'Поиск',
      chats: 'Чаты',
      global: 'Глобальные чаты'
    },
    language: {
      text: 'Язык',
      english: 'English',
      russian: 'Русский'
    },
    theme: {
      text: 'Тема',
      light: 'Светлая',
      dark: 'Темная'
    },
    setting: {
      text: 'Настройки'
    },
    userState: {
      lastSeen: 'последний раз видели недавно',
      offline: 'Не в сети',
      online: 'В сети',
      typing: '... печатает'
    },
    chat: {
      file: 'Файл',
      photo: 'Фото',
      inputPlaceholder: 'Сообщение',
      send: 'Отправить',
      sendFile: 'Отправить Файл',
      sendSmallAmountFiles: 'Отправить count файла',
      sendFiles: 'Отправить count Файлов',
      sendPhoto: 'Отправить Фото',
      sendPhotos: 'Отправить count Фото',
      sendMaxPhotos: 'макс(4)',
      sendInputPlaceholder: 'Добавить подпись...'
    },
    userInfo: 'Информация о пользователе'
  }
}