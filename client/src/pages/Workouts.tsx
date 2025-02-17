import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import { Separator } from "../components/ui/separator";
import { WorkoutsProvider, useWorkoutsContext } from "@/context/WorkoutsContext";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import WorkoutsWrapper from "@/components/workouts/WorkoutsWrapper";
function WorkoutsContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { fetchWorkouts } = useWorkoutsContext();
    const { fetchClients } = useClientsContext();

    useEffect(() => {
        fetchCoach();
        fetchPlans();
        fetchWorkouts();
        fetchClients();
    }, [fetchCoach, fetchPlans, fetchWorkouts, fetchClients]);
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start h-full gap-2">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-gray-200 mx-2" />
                            <h1 className="text-sm font-medium">Workouts</h1>
                        </div>
                    </header>
                    <WorkoutsWrapper />
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function Workouts() {
    return (
        <UserProvider>
            <PlanProvider>
                <ClientsProvider>
                    <WorkoutsProvider>
                        <WorkoutsContent />
                    </WorkoutsProvider>
                </ClientsProvider>
            </PlanProvider>
        </UserProvider>
    );
}