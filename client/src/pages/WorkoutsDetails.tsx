import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarInset } from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import WorkoutsDetailsWrapper from "../components/workouts/WorkoutsDetailsWrapper";
import { UserProvider } from "../context/UserContext";
import { PlanProvider, usePlanContext } from "../context/PlanContext";
import { useUser } from "../context/UserContext";
import { Toaster } from "../components/ui/toaster";
import { WorkoutsProvider } from "../context/WorkoutsContext";
import { useWorkoutsContext } from "../context/WorkoutsContext";

type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

function WorkoutsDetailsContent() {
    const { fetchCoach } = useUser();
    const { fetchPlans } = usePlanContext();
    const { fetchWorkouts } = useWorkoutsContext();
    const { id } = useParams();
    const [workout, setWorkout] = useState<Workout | null>(null);

    useEffect(() => {
        fetchCoach();
        fetchPlans();
        fetchWorkouts();
    }, [fetchCoach, fetchPlans, fetchWorkouts]);

    useEffect(() => {
        const fetchWorkout = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/app/workouts/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération du workout");
            }

            const data = await response.json();
            if (data) {
                setWorkout(data);
            } else {
                throw new Error("Aucune donnée reçue");
            }
        }
        fetchWorkout();
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
                            <h1 className="text-sm font-medium">Workout</h1>
                        </div>
                    </header>
                    <Toaster />
                    {workout && <WorkoutsDetailsWrapper workout={workout} />}
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}

export default function WorkoutsDetails() {
    return (
        <UserProvider>
            <PlanProvider>
                <WorkoutsProvider>
                    <WorkoutsDetailsContent />
                </WorkoutsProvider>
            </PlanProvider>
        </UserProvider>
    );
}