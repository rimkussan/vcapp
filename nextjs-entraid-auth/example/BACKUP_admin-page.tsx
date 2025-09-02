import Link from 'next/link';
import { getCurrentUser, userHasAnyRole, isPersonalAccount } from '@/lib/auth-helpers';
import Unauthorized from '@/components/Unauthorized';

const REQUIRED_ADMIN_ROLES = ['Admin', 'Administrator', 'Global Administrator'];

export default async function AdminPage() {
  const user = await getCurrentUser();
  const hasAdminRole = await userHasAnyRole(REQUIRED_ADMIN_ROLES);
  const isPersonal = await isPersonalAccount();

  // Show unauthorized if user doesn't have admin roles
  if (!hasAdminRole) {
    return (
      <Unauthorized 
        title="👑 Admin Page - Access Denied"
        reason={isPersonal ? 'personal-account' : 'insufficient-roles'}
        requiredRoles={REQUIRED_ADMIN_ROLES}
        message={
          isPersonal 
            ? "Admin functionality requires specific roles, which are not available for personal Microsoft accounts."
            : undefined
        }
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
          👑 Admin Page
        </h1>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">
            Admin Access Granted
          </h2>
          <p className="text-purple-700">
            You have successfully accessed the admin panel! You have one of the required admin roles.
          </p>
        </div>

        {/* Admin User Information */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">Admin User Information:</h3>
          <div className="space-y-2 text-indigo-700">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>All Roles:</strong> {user?.roles?.join(', ') || 'None'}</p>
            <p><strong>Admin Roles:</strong> {user?.roles?.filter((role: string) => REQUIRED_ADMIN_ROLES.includes(role)).join(', ') || 'None'}</p>
            {user?.jobTitle && <p><strong>Job Title:</strong> {user.jobTitle}</p>}
            {user?.department && <p><strong>Department:</strong> {user.department}</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What this demonstrates:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Specific role-based authorization (requires admin roles)</li>
            <li>Multiple role options (Admin, Administrator, Global Administrator)</li>
            <li>Claims and roles extraction from Entra ID tokens</li>
            <li>Fine-grained access control with clear error messages</li>
            <li>Server-side role validation</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Required Roles:</strong> {REQUIRED_ADMIN_ROLES.join(', ')}
            <br />
            <strong>Your Matching Roles:</strong> {user?.roles?.filter((role: string) => REQUIRED_ADMIN_ROLES.includes(role)).join(', ') || 'None'}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/protected"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Protected Page
          </Link>
        </div>
      </div>
    </div>
  );
}