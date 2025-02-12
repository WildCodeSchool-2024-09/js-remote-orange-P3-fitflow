import CoursItem from "../cours/CoursItem";

type Cours = {
    id: number;
    coach_id: number;
    title: string;
    current_status: string;
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
    cours: Cours[];
}

function ClientCourseSubscription({ client }: { client: Client, participants: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start justify-start w-full h-fit p-6 gap-4">
            {client?.cours?.map((cours) => (
                <CoursItem
                    key={cours.id}
                    cours={cours}
                />
            ))}
        </div>
    );
}

export default ClientCourseSubscription;