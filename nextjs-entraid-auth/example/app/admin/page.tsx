import { auth } from "../../auth"
import { redirect } from "next/navigation"

const REQUIRED_ADMIN_ROLES = ['Admin', 'Administrator', 'Global Administrator'];

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const user = session.user as any
  const hasAdminRole = user?.roles && user.roles.length > 0 && 
    REQUIRED_ADMIN_ROLES.some((role: string) => user.roles.includes(role))
  const isPersonal = user?.isPersonalAccount === true

  // Show unauthorized page for users without admin roles
  if (!hasAdminRole) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-red-600 mb-8">🚫 Unauthorized</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Admin Access Denied
            </h2>
            <p className="text-red-700 mb-4">
              This page requires administrative roles to access admin functionality.
            </p>
            <p className="text-red-600 text-sm">
              {isPersonal 
                ? "Admin functionality requires specific roles, which are not available for personal Microsoft accounts."
                : `Required roles: ${REQUIRED_ADMIN_ROLES.join(', ')}. Contact your administrator for access.`
              }
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">What you can do:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-left">
              <li>Contact your system administrator to request admin roles</li>
              <li>Verify you're using the correct organizational account</li>
              <li>Check if your admin roles have been recently updated</li>
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
              href="/admin"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Refresh Page
            </a>
          </div>
        </div>
      </main>
    )
  }

  // Show admin dashboard for users with admin roles
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">👑 Admin Dashboard</h1>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Admin Access Granted
          </h2>
          <p className="text-lg mb-4">
            You have successfully accessed the admin dashboard! You have one of the required admin roles.
          </p>
        </div>

        {/* Admin User Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Admin User Information:</h3>
          
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
                <span className="font-medium text-gray-600">All Roles:</span>
                <span className="text-gray-800">
                  {user.roles?.join(', ') || 'None'}
                </span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Admin Roles:</span>
                <span className="text-gray-800 font-semibold">
                  {user.roles?.filter((role: string) => REQUIRED_ADMIN_ROLES.includes(role)).join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Admin Access Control</h3>
          <p className="text-indigo-700 text-sm">
            <strong>Required Roles:</strong> {REQUIRED_ADMIN_ROLES.join(', ')}
            <br />
            <strong>Your Admin Roles:</strong> {user.roles?.filter((role: string) => REQUIRED_ADMIN_ROLES.includes(role)).join(', ') || 'None'}
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What this demonstrates:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Specific admin role-based authorization</li>
            <li>Multiple admin role options (Admin, Administrator, Global Administrator)</li>
            <li>Claims and roles extraction from Entra ID tokens</li>
            <li>Fine-grained access control with clear error messages</li>
            <li>Server-side admin role validation</li>
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Protected Page
          </a>
        </div>
      </div>
    </main>
  )
}