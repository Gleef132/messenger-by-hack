'use server'
import { cookies } from 'next/headers'
import HomePage from '@/components/screens/home/home'
import styles from './page.module.scss'
import { redirect } from 'next/navigation'
import { getChatUsers, getUser } from './actions'
import Popup from '@/components/ui/popup/popup'
import { languages } from '@/lib/languages';

export default async function Home() {
  const cookiesList = cookies()
  const tokenCookie = cookiesList.get('token')
  const languageCookie = cookiesList.get('language')

  if (!tokenCookie?.value) {
    redirect('/auth')
  }

  const user = await getUser()
  const chatUsers = await getChatUsers(`Bearer ${tokenCookie.value}`)

  return (
    <>
      <main className={styles.main}>
        <HomePage language={languageCookie ? languages[languageCookie.value] : languages.en} user={user} chatUsers={chatUsers} />
        <Popup />
      </main>
    </>
  )
}
