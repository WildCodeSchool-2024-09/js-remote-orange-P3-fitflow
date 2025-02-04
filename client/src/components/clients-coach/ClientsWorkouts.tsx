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

function ClientsWorkouts({ client, openDetails }: { client: Client, openDetails: boolean }) {
    return (
        <div className={`flex flex-col items-center justify-center w-full h-full p-6 ${openDetails === false ? "block" : "hidden"}`}>
            <h2>Workouts de {client.first_name} {client.last_name}</h2>
        </div>
    );
}

export default ClientsWorkouts;