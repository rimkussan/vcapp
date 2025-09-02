import { auth } from "../../auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const user = session.user as any
  const hasRoles = user?.roles && user.roles.length > 0
  const isPersonal = user?.isPersonalAccount === true

  // Show unauthorized page for users without roles
  if (!hasRoles) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-red-600 mb-8">🚫 Unauthorized</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Access Denied
            </h2>
            <p className="text-red-700 mb-4">
              This page requires specific user roles to access detailed information.
            </p>
            <p className="text-red-600 text-sm">
              {isPersonal 
                ? "Personal Microsoft accounts don't support application roles. Please contact your administrator to use an organizational account."
                : "You don't currently have any roles assigned. Contact your administrator for role assignments to access this content."
              }
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">What you can do:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-left">
              <li>Contact your system administrator to request the necessary roles</li>
              <li>Verify you're using the correct account (organizational vs personal)</li>
              <li>Check if your roles have been recently updated (may require re-login)</li>
            </ul>
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
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Refresh Page
            </a>
          </div>
        </div>
      </main>
    )
  }

  // Show detailed information for users with roles
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">🔒 Protected Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            This page is only accessible to authenticated users with roles.
          </h2>
          <p className="text-lg mb-4">
            You have access to view detailed information because you have assigned roles.
          </p>
        </div>

        {/* User Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">User Session Details:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-800">{user?.name || 'Not available'}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{user?.email || 'Not available'}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Account Type:</span>
                <span className="text-gray-800">
                  {isPersonal ? 'Personal Microsoft Account' : 'Organizational Account'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {user?.jobTitle && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Job Title:</span>
                  <span className="text-gray-800">{user.jobTitle}</span>
                </div>
              )}
              
              {user?.department && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Department:</span>
                  <span className="text-gray-800">{user.department}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Roles:</span>
                <span className="text-gray-800">
                  {user.roles.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Role-Based Access</h3>
          <p className="text-blue-700 text-sm">
            You have {user.roles.length} role{user.roles.length !== 1 ? 's' : ''} assigned: <strong>{user.roles.join(', ')}</strong>
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </a>
          <a
            href="/admin"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Admin Page →
          </a>
        </div>
      </div>
    </main>
  )
}