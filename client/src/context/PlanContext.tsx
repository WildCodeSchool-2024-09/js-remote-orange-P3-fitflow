import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
type Plan = {
    id: number;
    plan_name: string;
    plan_description: string;
    price_per_month: number;
    price_per_year: number;
}

type Feature = {
    id: number;
    plan_id: number;
    feature_name: string;
}

type Coach = {
    id: number;
    user_id: number;
    plan_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    profile_picture: string;
    speciality: string;
    bio: string;
}

type User = {
    id: number;
    email: string;
    password: string;
    user_role: string;
}

type PlanSubscription = {
    id: number;
    coach_id: number;
    plan_id: number;
    subscription_start_date: Date;
    subscription_end_date: Date;
    subscription_status: string;
    type_of_subscription: string;
}

type PlanContextType = {
    plans: Plan[];
    features: Feature[];
    coach: Coach | null;
    userData: User | null;
    planSubscription: PlanSubscription | null;
    setPlans: (plans: Plan[]) => void;
    setFeatures: (features: Feature[]) => void;
    setPlanSubscription: (subscription: PlanSubscription | null) => void;
    setCoach: (coach: Coach | null) => void;
    fetchPlans: () => Promise<void>;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [coach, setCoach] = useState<Coach | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [planSubscription, setPlanSubscription] = useState<PlanSubscription | null>(null);
    const navigate = useNavigate();

    const fetchPlans = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3310/app/plans", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            const data = await response.json();
            setUserData(data.user);
            setCoach(data.coachData);
            setPlans(data.plans);
            setFeatures(data.features);
            setPlanSubscription(data.planSubscription);

        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            navigate("/login");
        }
    }, [navigate]);

    return (
        <PlanContext.Provider value={{
            plans,
            features,
            coach,
            setPlans,
            setFeatures,
            fetchPlans,
            userData,
            planSubscription,
            setPlanSubscription,
            setCoach
        }}>
            {children}
        </PlanContext.Provider>
    );
}

export function usePlanContext() {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error("usePlanContext must be used within a PlanProvider");
    }
    return context;
}