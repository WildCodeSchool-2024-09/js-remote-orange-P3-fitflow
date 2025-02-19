import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect, useState } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import { Separator } from "../components/ui/separator";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import ClientsDetailsWrapper from "@/components/clients-coach/ClientsDetailsWrapper";
import { useParams } from "react-router-dom";

type Client = {
    id: number;
    coach_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
}

function ClientsContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { fetchClients } = useClientsContext();
    const { id } = useParams();

    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        fetchCoach();
        fetchPlans();
        fetchClients();
    }, [fetchCoach, fetchPlans, fetchClients]);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`http://localhost:3310/app/clients/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                setClient(data);
            } catch (error) {
                // TODO: handle error
            }
        };
        fetchClient();
    }, [id]);

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
                    {client && <ClientsDetailsWrapper client={client} />}
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