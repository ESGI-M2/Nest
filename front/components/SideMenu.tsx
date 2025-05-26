"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import UserList from "./ui/users/user-list";
import ConversationList from "./ui/conversations/conversation-list";
import NewConversation from "./ui/conversations/new-conversation";

export default function SideMenu() {
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent className="flex flex-col gap-4">
                <NewConversation />
                <ConversationList />
                <UserList />
            </SidebarContent>
        </Sidebar>
    );
}
