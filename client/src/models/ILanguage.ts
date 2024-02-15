export interface ILanguageData{
  title: string;
  auth: {
    login: {
      text: string;
      errorEmpty: string;
    }
    password: {
      text: string;
      errorEmpty: string;
    }
    loginButton: string;
    registrButton: string;
  }
  search: {
    inputPlaceholder: string;
    global: string;
    chats: string;
  }
  setting: {
    text: string;
  }
  userState: {
    online: string;
    typing: string;
    offline: string;
    lastSeen: string;
  }
  language: {
    text: string;
    english: 'English';
    russian: 'Русский';
  }
  theme: {
    text: string;
    light: string;
    dark: string;
  }
  chat:{
    inputPlaceholder: string;
    photo: string;
    file: string;
    send: string;
    sendPhoto: string;
    sendPhotos: string;
    sendMaxPhotos: string;
    sendFile: string;
    sendFiles: string;
    sendSmallAmountFiles: string;
    sendInputPlaceholder: string;
  }
  userInfo: string;
}