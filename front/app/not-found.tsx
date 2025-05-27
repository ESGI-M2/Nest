'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oups ! Page introuvable.</p>
      <Link href="/" className="btn btn-primary">
        Retour à l’accueil
      </Link>
    </div>
  );
}