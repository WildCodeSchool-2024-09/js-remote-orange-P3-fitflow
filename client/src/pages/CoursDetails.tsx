import { useParams } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CoursProvider, useCoursContext } from "@/context/CoursContext";
import { useEffect, useState } from "react";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import { UserProvider, useUser } from "@/context/UserContext";
import CoursDetailsWrapper from "@/components/cours/CoursDetailsWrapper";
import { PlanProvider, usePlanContext } from "@/context/PlanContext";
type Course = {
    id: number;
    coach_id: number;
    current_status: string;
    title: string;
    description_notes: string;
    price: number;
    is_free: boolean;
    start_date: string;
    start_time: string;
    end_time: string;
    location_link: string;
    max_participants: number;
}

function CoursDetailsContent() {
    const { fetchCours } = useCoursContext();
    const { fetchClients } = useClientsContext();
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        fetchCours();
        fetchClients();
        fetchCoach();
        fetchPlans();
    }, [fetchCours, fetchClients, fetchCoach, fetchPlans]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                    method: "GET",
                    credentials: "include",
                })
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                // TODO: handle error
            }
        }
        fetchCourse();
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
                            <h1 className="text-sm font-medium">Cours</h1>
                        </div>
                    </header>
                    {course && <CoursDetailsWrapper course={course} />}
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function CoursDetails() {
    return (
        <UserProvider>
            <PlanProvider>
                <ClientsProvider>
                    <CoursProvider>
                        <CoursDetailsContent />
                    </CoursProvider>
                </ClientsProvider>
            </PlanProvider>
        </UserProvider>
    );
}