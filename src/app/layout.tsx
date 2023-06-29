import './globals.css'
import { Inter } from 'next/font/google'
import { AuthComponent } from '@/src/app/context/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LIFFサンプルアプリ',
  description: 'Next13ベースのサンプルアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <AuthComponent>{children}</AuthComponent>
      </body>
    </html>
  )
}
