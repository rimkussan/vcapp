'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = () => {
    window.location.href = '/api/auth/signin';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h1>
            <p className="text-gray-600">
              Please sign in with your Microsoft account to access this application.
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium mb-4"
          >
            Sign in with Microsoft
          </button>

          <div className="text-sm text-gray-500">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">About this login:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Uses OAuth 2.0 + OpenID Connect</li>
            <li>• Secure token exchange with PKCE</li>
            <li>• HttpOnly cookies for session management</li>
            <li>• CSRF protection enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}