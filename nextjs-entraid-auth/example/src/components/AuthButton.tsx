'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-gray-200 rounded-md h-10 w-24"></div>
    );
  }

  if (session?.user) {
    const user = session.user as any;
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.roles && user.roles.length > 0 && (
            <p className="text-xs text-blue-600">
              Roles: {user.roles.join(', ')}
            </p>
          )}
          {user.jobTitle && (
            <p className="text-xs text-gray-500">
              {user.jobTitle}
            </p>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('microsoft-entra-id')}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign In
    </button>
  );
}