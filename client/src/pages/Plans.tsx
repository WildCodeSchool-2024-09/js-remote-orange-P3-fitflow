import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import PlanContainer from "@/components/plans/PlanContainer";
import { Separator } from "@/components/ui/separator";

function PlansContent() {
    const { fetchPlans } = usePlanContext();
    const { fetchCoach } = useUser();

    useEffect(() => {
        fetchCoach();
        fetchPlans();
    }, [fetchCoach, fetchPlans]);

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start pb-10">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start gap-2 h-full">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-gray-200 mx-2" />
                            <h1 className="text-sm font-medium">Plans</h1>
                        </div>
                    </header>
                    <PlanContainer />
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function Plans() {
    return (
        <UserProvider>
            <PlanProvider>
                <PlansContent />
            </PlanProvider>
        </UserProvider>
    );
}