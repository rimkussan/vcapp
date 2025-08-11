import Image from "next/image";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 w-full max-w-4xl flex justify-end">
        <AuthButton />
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="text-2xl font-bold text-blue-600">+</div>
          <div className="text-xl font-semibold">Microsoft Entra ID</div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">🔐 Enterprise Authentication Demo</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This application demonstrates secure Microsoft Entra ID authentication with:
          </p>
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
            <li>OAuth 2.0 + OpenID Connect</li>
            <li>HttpOnly cookie sessions</li>
            <li>CSRF protection</li>
            <li>Role-based access control</li>
            <li>Multi-tenant support</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-blue-600 bg-blue-600 text-white transition-colors flex items-center justify-center hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/protected"
          >
            🔒 Protected Page
          </a>
          <a
            className="rounded-full border border-solid border-purple-600 bg-purple-600 text-white transition-colors flex items-center justify-center hover:bg-purple-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/admin"
          >
            👑 Admin Page
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://github.com/your-org/nextjs-entraid-auth"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 View Source
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500">
        <span>© 2024 Entra ID Auth Toolkit</span>
        <span>•</span>
        <span>Built with ❤️ for Enterprise</span>
      </footer>
    </div>
  );
}
