"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const userJson = window.localStorage.getItem("user");
    const storedUser = userJson ? JSON.parse(userJson) : null;
    setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-semibold text-gray-800 mb-4">Tableau de bord</h1>
      <p className="text-lg text-gray-600 mb-4">
        Bienvenue sur votre tableau de bord, <span className="font-bold text-indigo-600">{user.firstName} {user.lastName}</span> !
      </p>
      <p className="text-lg text-gray-600 mb-4">
        Ici, vous pouvez gérer vos paramètres et préférences de compte.
      </p>
      <p className="text-lg text-gray-600 mb-4">
        N'hésitez pas à explorer les différentes fonctionnalités à votre disposition.
      </p>
      <div className="mt-8 bg-gray-100 p-4 rounded-md">
        <a href="/chat" className="text-lg text-gray-700">Vous êtes prêt à commencer à discuter ? Explorez vos messages ci-dessous !</a>
      </div>
    </div>
  );
}
