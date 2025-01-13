import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";

function PlansContent() {
    const { coach, fetchCoach } = useUser();

    useEffect(() => {
        fetchCoach();
    }, []);
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start gap-2">
                            <SidebarTrigger />
                            <h1 className="text-sm font-medium">Plans</h1>
                            <p>{coach?.email}</p>
                            <p>{coach?.first_name}</p>
                        </div>
                    </header>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function Plans() {
    return (
        <UserProvider>
            <PlansContent />
        </UserProvider>
    );
}