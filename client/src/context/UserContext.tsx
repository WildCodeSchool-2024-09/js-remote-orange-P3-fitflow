import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
    id: number;
    email: string;
    password: string;
    user_role: string;
}

type Coach = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    // Ajoutez d'autres propriétés du coach selon vos besoins
}

type UserContextType = {
    userData: User | null;
    coach: Coach | null;
    setUser: (user: User | null) => void;
    fetchCoach: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<User | null>(null);
    const [coach, setCoach] = useState<Coach | null>(null);
    const navigate = useNavigate();

    const fetchCoach = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3310/app/dashboard", {
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

            if (data.coach) {
                setCoach(data.coach);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleSetUser = async (newUser: User | null) => {
        if (newUser === null) {
            try {
                await fetch("http://localhost:3310/app/dashboard", {
                    method: "POST",
                    credentials: "include",
                });
                setUserData(null);
                navigate("/login");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        } else {
            setUserData(newUser);
        }
    };

    return (
        <UserContext.Provider value={{ userData, coach, setUser: handleSetUser, fetchCoach }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser doit être utilisé à l&apos;intérieur d&apos;un UserProvider');
    }
    return context;
}
