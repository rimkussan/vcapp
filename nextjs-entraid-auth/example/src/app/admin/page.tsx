import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
          👑 Admin Page
        </h1>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">
            Role-Based Access Control
          </h2>
          <p className="text-purple-700">
            This page requires the "Admin" role. If you can see this, you have the required permissions!
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What this demonstrates:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Role-based authorization using middleware</li>
            <li>Claims and roles extraction from Entra ID tokens</li>
            <li>Fine-grained access control for different user types</li>
            <li>Custom error handling for insufficient permissions</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> To test this functionality, configure roles in your Entra ID application 
            and assign the "Admin" role to your user account.
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