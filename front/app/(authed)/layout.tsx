import UserList from "@/components/ui/users/user-list";
import { AuthProvider } from "@/context/authContext";

import SideMenu from "@/components/SideMenu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavBar from "@/components/ui/navbar";

export default function AuthedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const users = [
        {
            id: "a2ec0945-99b5-42eb-918d-f996ccb787f4",
            email: "m.johan.rkt@gmail.com",
            firstName: "Johan Mickaël",
            lastName: "RAKOTONIAINA",
            profileColor: null,
        },
        {
            id: "ba680ecd-ae2d-4b91-b1b3-5a688148b8d5",
            email: "leadaniie@gmail.com",
            firstName: "Marie Léoncia",
            lastName: "ZANDRIARIVOLA",
            profileColor: null,
        },
        {
            id: "75de1fcc-59ca-42b0-91e8-33caccc787bc",
            email: "jrakotoniaina2@myges.fr",
            firstName: "Johan",
            lastName: "ESGI",
            profileColor: null,
        },
    ];

    return (
        <SidebarProvider>
            <AuthProvider>
                <div className="p-4 bg-base-300">
                    <SideMenu />
                </div>
                <main className="w-full flex flex-col">
                    <NavBar />
                    {children}
                </main>
            </AuthProvider>
        </SidebarProvider>
    );
}
