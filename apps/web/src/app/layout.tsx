import type { Metadata } from 'next'
import '../styles/globals.css'
import { AuthWrapper } from '@/components/auth/AuthWrapper'

export const metadata: Metadata = {
  title: 'Department Workflow Platform',
  description: 'A workflow-driven platform for managing academic operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
