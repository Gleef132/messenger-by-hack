import Auth from '@/components/screens/auth/auth'
import { languages } from '@/lib/languages'
import { NextPage } from 'next'
import { cookies } from 'next/headers'

const LoginPage: NextPage = () => {

  const cookiesList = cookies()
  const languageCookie = cookiesList.get('language')

  return <Auth language={languageCookie ? languages[languageCookie.value] : languages.en} />
}

export default LoginPage