import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import { Separator } from "../components/ui/separator";
import ClientsWrapper from "@/components/clients-coach/ClientsWrapper";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
function ClientsContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { fetchClients } = useClientsContext();

    useEffect(() => {
        fetchCoach();
        fetchPlans();
        fetchClients();
    }, [fetchCoach, fetchPlans, fetchClients]);
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start h-full gap-2">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-gray-200 mx-2" />
                            <h1 className="text-sm font-medium">Clients</h1>
                        </div>
                    </header>
                    <ClientsWrapper />
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}

export default function Clients() {
    return (
        <UserProvider>
            <PlanProvider>
                <ClientsProvider>
                    <ClientsContent />
                </ClientsProvider>
            </PlanProvider>
        </UserProvider>
    );
}