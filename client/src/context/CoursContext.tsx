import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type Cours = {
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
    participants_count: number;
}

type CoursContextType = {
    cours: Cours[];
    setCours: (cours: Cours[]) => void;
    fetchCours: () => Promise<void>;
}

export const CoursContext = createContext<CoursContextType | undefined>(undefined);

export function CoursProvider({ children }: { children: ReactNode }) {
    const [cours, setCours] = useState<Cours[]>([]);

    const fetchCours = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3310/app/cours", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des cours");
            }
            const data = await response.json();
            setCours(data);
        } catch (error) {
            // TODO: handle error
        }
    }, []);

    return (
        <CoursContext.Provider value={{
            cours,
            setCours,
            fetchCours,
        }}>
            {children}
        </CoursContext.Provider>
    );
}

export function useCoursContext() {
    const context = useContext(CoursContext);
    if (!context) {
        throw new Error("useCoursContext must be used within a CoursProvider");
    }
    return context;
}