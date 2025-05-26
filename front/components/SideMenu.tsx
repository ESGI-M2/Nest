"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import UserList from "./ui/users/user-list";
import ConversationList from "./ui/conversations/conversation-list";
import NewConversation from "./ui/conversations/new-conversation";

export default function SideMenu() {
    const router = useRouter();

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <NewConversation />
                <ConversationList />
                <UserList />
            </SidebarContent>
            <SidebarFooter>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full"
                >
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
