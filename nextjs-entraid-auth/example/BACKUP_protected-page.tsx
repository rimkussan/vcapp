import Link from 'next/link';
import { getCurrentUser, isPersonalAccount } from '@/lib/auth-helpers';

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  const isPersonal = await isPersonalAccount();
  const hasRoles = user?.roles && user.roles.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          🔒 Protected Page
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            This page is only accessible to authenticated users.
          </h2>
          <p className="text-blue-700">
            {hasRoles 
              ? "You have access to view detailed information because you have assigned roles."
              : "You are authenticated, but additional role-based features may be limited."
            }
          </p>
        </div>

        {/* User Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Session:</h3>
          
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
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Roles:</span>
              <span className={`text-gray-800 ${!hasRoles ? 'italic text-gray-500' : ''}`}>
                {hasRoles ? user.roles.join(', ') : 'No roles assigned'}
              </span>
            </div>
          </div>
        </div>

        {/* Role Status Section */}
        {!hasRoles && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Role Information</h3>
            <p className="text-yellow-700 text-sm">
              {isPersonal 
                ? "Personal Microsoft accounts don't support application roles. For role-based features, use an organizational account."
                : "You don't currently have any roles assigned. Contact your administrator for role assignments if you need access to additional features."
              }
            </p>
          </div>
        )}

        {hasRoles && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Role-Based Access</h3>
            <p className="text-green-700 text-sm">
              You have {user.roles.length} role{user.roles.length !== 1 ? 's' : ''} assigned: <strong>{user.roles.join(', ')}</strong>
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What this demonstrates:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Server-side authentication check using middleware</li>
            <li>Clean user session information display</li>
            <li>Role-based content and messaging</li>
            <li>Personal vs organizational account detection</li>
            <li>Secure session management with NextAuth.js</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Admin Page →
          </Link>
        </div>
      </div>
    </div>
  );
}