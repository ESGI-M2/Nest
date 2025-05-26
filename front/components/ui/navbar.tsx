"use client";

import { SidebarTrigger } from "./sidebar"
import { Bubble } from "./bubble";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { state: authState } = useAuth();
  const initials = `${authState.currentUser?.firstName[0] ?? ''}${authState.currentUser?.lastName[0] ?? ''}`.toUpperCase();
  const router = useRouter();

   const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <SidebarTrigger />
      <div className="flex-1">
      </div>
      <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10">
            <Bubble
              firstLetter={initials}
              profileColor={authState.currentUser?.profileColor}
            />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a href="/params">Paramètres</a></li>
          <li><button onClick={handleLogout}>Déconnexion</button></li>
      </ul>
    </div>
    </div>
  );
}