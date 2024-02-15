'use server'
import { cookies } from 'next/headers'
import HomePage from '@/components/screens/home/home'
import styles from './page.module.scss'
import { redirect } from 'next/navigation'
import { getChatUsers, getUser } from './actions'
import { IUser } from '@/models/IUser'
import Popup from '@/components/ui/popup/popup'
import { languages } from '@/lib/languages';

export default async function Home() {
  const cookiesList = cookies()
  const hasTokenCookie = cookiesList.has('token')
  const languageCookie = cookiesList.get('language')

  // let user = {};

  if (!hasTokenCookie) {
    redirect('/auth')
  }

  const user = await getUser()
  const chatUsers = await getChatUsers()

  return (
    <>
      <main className={styles.main}>
        <HomePage language={languageCookie ? languages[languageCookie.value] : languages.en} user={user} chatUsers={chatUsers} />
        <Popup />
      </main>
    </>
  )
}