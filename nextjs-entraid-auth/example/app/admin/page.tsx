import { auth } from "../../auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  // In a real app, you would check for admin role here
  // For example: if (!session.user.roles?.includes('admin')) { redirect('/') }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">👤 Admin Dashboard</h1>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <p className="text-lg mb-4">
            Admin-only area. Role-based access control can be implemented here.
          </p>
          
          <div className="bg-white rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Full Session Details:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </a>
          
          <a
            href="/protected"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Protected Page
          </a>
        </div>
      </div>
    </main>
  )
}