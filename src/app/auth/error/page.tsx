import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const message = searchParams.message || 'Authentication error occurred';

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-concrete/60 backdrop-blur-md border border-white/10 p-8 text-center">
        <AlertCircle className="h-16 w-16 text-copper mx-auto mb-6" />

        <h1 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-4">
          ACCESS RESTRICTED
        </h1>

        <p className="text-stone mb-6 leading-relaxed">
          {message}
        </p>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-copper text-dark py-3 px-6 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
          >
            Try Different Email
          </Link>

          <p className="text-xs text-stone/70">
            This site is currently in private beta.
          </p>
        </div>
      </div>
    </div>
  );
}
