import { useEffect } from 'react';
import { getCookie } from '@/utils/getCookie';
import { setCookie } from '@/utils/setCookie';

type Theme = 'light' | 'dark';

export const useTheme = () => {

  useEffect(() => {
    const themeInCookies: Theme = getCookie('theme') as Theme;
    const themeInSystem: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const themeToSet = themeInCookies || themeInSystem;

    setCookie('theme',themeToSet)
    document.documentElement.setAttribute('data-theme', themeToSet);
  }, []);

  const setTheme = (theme: Theme) => {
    if(typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    setCookie('theme',theme)
  };

  return { setTheme };
};
