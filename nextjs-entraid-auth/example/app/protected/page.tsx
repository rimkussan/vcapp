import { auth } from "../../auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">🔒 Protected Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-lg mb-4">
            This page is only accessible to authenticated users.
          </p>
          
          <div className="bg-white rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-2">User Session:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        </div>
        
        <a
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  )
}