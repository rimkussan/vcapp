import Link from 'next/link';

export default function ProtectedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          🔒 Protected Page
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-green-700">
            If you can see this page, you are successfully authenticated with Microsoft Entra ID!
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What this demonstrates:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Server-side authentication check using middleware</li>
            <li>Secure session management with HttpOnly cookies</li>
            <li>Automatic redirection to login for unauthenticated users</li>
            <li>Token validation and user session verification</li>
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