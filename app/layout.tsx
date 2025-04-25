import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buffer Calculator',
  description: 'Calculadora de pH para soluciones amortiguadoras',
  keywords: ['buffer', 'calculator', 'pH', 'chemistry'],
  authors: [{ name: 'Alvaro José Avendaño' }],
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
