"use client"

import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has been used already.",
    Default: "An unexpected error occurred during authentication.",
  }

  const message = errorMessages[error || "Default"] || errorMessages.Default

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-red-600">Authentication Error</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <p className="text-lg mb-2">
            {message}
          </p>
          {error && (
            <p className="text-sm text-gray-600">
              Error code: {error}
            </p>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signin"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
          
          <a
            href="/"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </main>
  )
}