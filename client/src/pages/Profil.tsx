import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
import { Separator } from "@/components/ui/separator";
import ProfileContent from "@/components/profile/ProfileContent";

function ProfilContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();

    useEffect(() => {
        fetchCoach();
        fetchPlans();
    }, [fetchCoach, fetchPlans]);

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col items-start justify-start">
                    <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                        <div className="flex items-center justify-start h-full gap-2">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-gray-200 mx-2" />
                            <h1 className="text-sm font-medium">Profil</h1>
                        </div>
                    </header>
                    <ProfileContent />
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function Profil() {
    return (
        <UserProvider>
            <PlanProvider>
                <ProfilContent />
            </PlanProvider>
        </UserProvider>
    );
}