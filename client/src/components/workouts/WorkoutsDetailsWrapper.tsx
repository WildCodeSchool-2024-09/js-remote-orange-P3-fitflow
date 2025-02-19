import { Button } from "../ui/button";
import { UserRoundCheck } from "lucide-react";
import DeleteWorkoutDialog from "./DeleteWorkoutDialog";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideWorkoutDetails from "./AsideWorkoutDetails";
import EditWorkoutDialog from "./EditWorkoutDialog";

type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

function WorkoutsDetailsWrapper({ workout }: { workout: Workout }) {
    const { id } = useParams();
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [workoutData, setWorkoutData] = useState<Workout>(workout);

    const refreshWorkoutData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/app/workouts/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            setWorkoutData(data);
        } catch (error) {
            console.error("Erreur lors du rafraîchissement des données:", error);
        }
    };

    useEffect(() => {
        refreshWorkoutData();
    }, [id]);

    return (
        <div className="flex flex-col items-start justify-start w-full h-full">
            <header className="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200">
                <h1 className="text-sm font-medium">{workout.title}</h1>
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline">
                        <UserRoundCheck className="w-4 h-4" />
                        Assigner à un client
                    </Button>
                    <EditWorkoutDialog
                        open={openEdit}
                        onOpenChange={setOpenEdit}
                        workout={workoutData}
                        onWorkoutUpdate={refreshWorkoutData}
                    />
                    <DeleteWorkoutDialog open={openDelete} onOpenChange={setOpenDelete} />
                </div>
            </header>
            <div className="flex items-start justify-start w-full h-full">
                <div className="flex flex-col items-start justify-start w-full">
                    <h1 className="text-sm font-medium">{workoutData.title}</h1>
                </div>
                <AsideWorkoutDetails workout={workoutData} />
            </div>
        </div>
    );
}

export default WorkoutsDetailsWrapper;