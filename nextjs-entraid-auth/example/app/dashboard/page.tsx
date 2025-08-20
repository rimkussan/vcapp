import { auth } from "../../auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Extract user details
  const user = session.user
  const accessToken = (session as any).accessToken

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Secure Dashboard</h1>
            <form
              action={async () => {
                "use server"
                const { signOut } = await import("../../auth")
                await signOut()
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Secure Dashboard</h2>
          <p className="text-gray-600">
            You have successfully authenticated using Microsoft Entra ID. This is a protected area that only authenticated users can access.
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">👤</span> User Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-lg">{user?.name || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg">{user?.email || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📊</span>
              <h3 className="text-lg font-semibold">Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm">View your organization's analytics and insights</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Analytics →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📁</span>
              <h3 className="text-lg font-semibold">Documents</h3>
            </div>
            <p className="text-gray-600 text-sm">Access shared documents and files</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Browse Files →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚙️</span>
              <h3 className="text-lg font-semibold">Settings</h3>
            </div>
            <p className="text-gray-600 text-sm">Manage your account preferences</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Settings →
            </button>
          </div>
        </div>

        {/* Session Details (for debugging) */}
        <details className="bg-white rounded-lg shadow p-6">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            🔍 Session Details (Debug Info)
          </summary>
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
{JSON.stringify({
  user: session.user,
  expires: session.expires,
  hasAccessToken: !!accessToken
}, null, 2)}
            </pre>
          </div>
        </details>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/protected"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Protected Page
          </a>
          <a
            href="/admin"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Admin Area
          </a>
          <a
            href="/"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  )
}