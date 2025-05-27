"use client";

import Link from "next/link";
import { SidebarTrigger } from "./sidebar";
import { Bubble } from "./bubble";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

export default function NavBar() {
    const { state: authState, logout } = useAuth();
    const initials = `${authState.currentUser?.firstName[0] ?? ""}${
        authState.currentUser?.lastName[0] ?? ""
    }`.toUpperCase();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm h-16">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="dropdown dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                >
                    <div className="w-10">
                        <Bubble
                            firstLetter={initials}
                            profileColor={
                                authState.currentUser?.profileColor || "#000000"
                            }
                        />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow-xl border border-primary"
                >
                    <li>
                        <Link href="/settings">
                            <Settings className="w-4 h-4" />
                            <span>Paramètres</span>
                        </Link>
                    </li>
                    <li>
                        <div>
                            <LogOut className="w-4 h-4" />
                            <button onClick={handleLogout}>Déconnexion</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
