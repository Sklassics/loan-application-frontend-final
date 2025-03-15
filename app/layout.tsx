import type { Metadata } from 'next'
import './globals.css'
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Loan-App',
  description: 'Offers loans at the best rates',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ToastContainer
        position="top-center"
        autoClose={5000}
      />
        {children}
      </body>
    </html>
  )
}