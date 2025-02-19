import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import { Separator } from "../components/ui/separator";
import { CoursProvider, useCoursContext } from "@/context/CoursContext";
import CoursWrapper from "@/components/cours/CoursWrapper";

function CoursContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { fetchCours } = useCoursContext();

    useEffect(() => {
        fetchCoach();
        fetchPlans();
        fetchCours();
    }, [fetchCoach, fetchPlans, fetchCours]);
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start h-full gap-2">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-gray-200 mx-2" />
                            <h1 className="text-sm font-medium">Cours</h1>
                        </div>
                    </header>
                    <CoursWrapper />
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function Cours() {
    return (
        <UserProvider>
            <PlanProvider>
                <CoursProvider>
                    <CoursContent />
                </CoursProvider>
            </PlanProvider>
        </UserProvider>
    );
}