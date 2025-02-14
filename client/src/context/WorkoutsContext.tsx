import { createContext, ReactNode, useCallback, useContext, useState } from "react";


type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

type WorkoutsContextType = {
    workouts: Workout[];
    setWorkouts: (workouts: Workout[]) => void;
    fetchWorkouts: () => Promise<void>;
}

export const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export function WorkoutsProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const fetchWorkouts = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/app/workouts`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des exercices");
            }
            const data = await response.json();
            setWorkouts(data);
        } catch (error) {
            // TODO: handle error
        }
    }, []);

    return (
        <WorkoutsContext.Provider value={{
            workouts,
            setWorkouts,
            fetchWorkouts,
        }}>
            {children}
        </WorkoutsContext.Provider>
    )
}

export function useWorkoutsContext() {
    const context = useContext(WorkoutsContext);
    if (!context) {
        throw new Error("Une erreur est survenue lors de la récupération des workouts");
    }
    return context;
}