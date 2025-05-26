import { AuthProvider } from "@/context/authContext";

import SideMenu from "@/components/SideMenu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavBar from "@/components/ui/navbar";
import { ConversationsProvider } from "@/context/conversationContext";

export default function AuthedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AuthProvider>
                <ConversationsProvider>
                    <div className="p-4 bg-base-300">
                        <SideMenu />
                    </div>
                    <main className="w-full flex flex-col">
                        <NavBar />
                        {children}
                    </main>
                </ConversationsProvider>
            </AuthProvider>
        </SidebarProvider>
    );
}
