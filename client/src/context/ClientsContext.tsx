import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type Client = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
}

type ClientsContextType = {
    clients: Client[];
    setClients: (clients: Client[]) => void;
    fetchClients: () => Promise<void>;
}

export const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);

    const fetchClients = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3310/app/clients", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des clients");
            }
            const data = await response.json();
            console.log("Données clients reçues:", data);
            setClients(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
    }, []);

    return (
        <ClientsContext.Provider value={{
            clients,
            setClients,
            fetchClients
        }}>
            {children}
        </ClientsContext.Provider>
    );
}

export function useClientsContext() {
    const context = useContext(ClientsContext);
    if (!context) {
        throw new Error("useClientsContext must be used within a ClientsProvider");
    }
    return context;
}