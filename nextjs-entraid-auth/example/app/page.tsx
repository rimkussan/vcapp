import { auth, signIn, signOut } from "../auth"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Next.js + Microsoft Entra ID
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">🔒 Enterprise Authentication Demo</h2>
          <p className="text-sm text-gray-600 mb-4">
            This application demonstrates secure Microsoft Entra ID authentication with:
          </p>
          <ul className="text-sm text-left max-w-md mx-auto space-y-1">
            <li>• OAuth 2.0 + OpenID Connect</li>
            <li>• Secure session management</li>
            <li>• Protected routes</li>
            <li>• Role-based access control</li>
            <li>• Multi-tenant support</li>
          </ul>
        </div>

        {session ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✅ Authenticated</h3>
              <p className="text-sm">Welcome, {session.user?.name || session.user?.email}!</p>
              {session.user?.email && (
                <p className="text-xs text-gray-600 mt-1">{session.user.email}</p>
              )}
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/dashboard"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Dashboard
              </a>

              <a
                href="/protected"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔒 Protected Page
              </a>
              
              <a
                href="/admin"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                👤 Admin Page
              </a>
              
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <form
            action={async () => {
              "use server"
              await signIn("microsoft-entra-id")
            }}
          >
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Sign In with Microsoft
            </button>
          </form>
        )}

        <div className="mt-8 text-xs text-gray-500">
          <a 
            href="https://github.com/your-org/nextjs-entraid-auth"
            className="hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 View Source
          </a>
        </div>
      </div>
    </main>
  )
}