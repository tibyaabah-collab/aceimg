import AdminClient from "./_components/AdminClient"
import { revalidatePath } from "next/cache"

export default function AdminPage() {
  return (
    <main className="container">
      <h1 style={{marginBottom: '2rem'}}>Admin Video Affiliate</h1>
      <AdminClient />
    </main>
  )
}
