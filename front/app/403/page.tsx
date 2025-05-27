import Link from 'next/link';

export const metadata = {
  title: '403 — Accès refusé',
};

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <p className="text-xl mb-8">Accès refusé : vous n’avez pas la permission.</p>
      <Link href="/" className="btn btn-primary">
        Retour à l’accueil
      </Link>
    </div>
  );
}
