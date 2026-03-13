import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Development Potential App',
  description: 'Planning-led site screening and development appraisal prototype.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
