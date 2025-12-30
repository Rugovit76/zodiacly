import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'
import ContactForm from './ContactForm'

export default async function ContactPage() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <ContactForm user={session} />
    </div>
  )
}
