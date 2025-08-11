import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-4xl mb-2">🚫</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have the required permissions to access this resource.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-700">
              This page requires specific roles or claims that are not present in your account.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/protected"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Try Protected Page
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Need access?</h3>
          <p className="text-sm text-gray-600">
            Contact your administrator to request the appropriate roles or permissions 
            for your Microsoft Entra ID account.
          </p>
        </div>
      </div>
    </div>
  );
}