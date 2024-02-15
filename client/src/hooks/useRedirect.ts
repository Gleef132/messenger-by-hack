import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { getCookie } from "@/utils/getCookie";

export const useRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    const handlePopState = () => {
      const isAuth = getCookie('token');
      if (isAuth) {
          router.replace('/');
      } else {
          router.replace('/auth');
      }
    };

    window.addEventListener('popstate', handlePopState);

    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}
