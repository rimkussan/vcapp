import { signIn } from "../../../auth"

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Sign In Required</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-lg mb-4">
            Please sign in to access this application.
          </p>
        </div>
        
        <form
          action={async () => {
            "use server"
            await signIn("microsoft-entra-id")
          }}
        >
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Sign In with Microsoft
          </button>
        </form>
        
        <div className="mt-8">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}