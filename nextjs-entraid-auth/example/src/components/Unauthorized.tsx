import Link from 'next/link';

interface UnauthorizedProps {
  title?: string;
  message?: string;
  reason?: 'no-roles' | 'personal-account' | 'insufficient-roles';
  requiredRoles?: string[];
}

export default function Unauthorized({ 
  title = "🚫 Access Denied", 
  message,
  reason = 'no-roles',
  requiredRoles = []
}: UnauthorizedProps) {
  
  const getDefaultMessage = () => {
    switch (reason) {
      case 'personal-account':
        return "This page requires specific roles, which are not available for personal Microsoft accounts. Please contact your administrator to use an organizational account.";
      case 'no-roles':
        return "This page requires specific user roles. You don't currently have any roles assigned to your account.";
      case 'insufficient-roles':
        return `This page requires one of the following roles: ${requiredRoles.join(', ')}. Please contact your administrator for access.`;
      default:
        return "You don't have permission to access this page.";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          {title}
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Authorization Required
          </h2>
          <p className="text-red-700">
            {message || getDefaultMessage()}
          </p>
          
          {requiredRoles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-red-600 font-medium">Required roles:</p>
              <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                {requiredRoles.map(role => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What you can do:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Contact your system administrator to request the necessary roles</li>
            <li>Verify you're using the correct account (organizational vs personal)</li>
            <li>Check if your roles have been recently updated (may require re-login)</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}