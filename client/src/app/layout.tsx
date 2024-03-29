import { StoreProvider } from '@/store/StoreProvider'
import '@/styles/globals.scss'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { FontsVariables } from './fonts'

export const metadata: Metadata = {
  title: 'Messenger | by Hack',
  description: 'Free messenger for you!',
  icons: './logo.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookiesList = cookies()
  const themeCookie = cookiesList.get('theme')

  return (
    <StoreProvider>
      <html lang="en" data-theme={themeCookie?.value || undefined} suppressHydrationWarning={true}>
        <head>
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (!document.documentElement.getAttribute('data-theme')) {
                  var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                }
              })();
            `
          }} />
        </head>
        <body className={FontsVariables} >
          {children}
        </body>
      </html>
    </StoreProvider>
  )
}
