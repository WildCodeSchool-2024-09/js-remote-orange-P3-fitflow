import { DataTable } from "./data-table";
import { columns } from "./columns";

type Clients = {
    id: number
    coach_id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    gender: string
    birth_date: string
    weight_kg: number
    height_cm: number
    notes: string
}

const clients: Clients[] = [
    {
        id: 1,
        coach_id: "1",
        email: "email@gmail.com",
        first_name: "John",
        last_name: "Doe",
        phone: "0606060606",
        gender: "male",
        birth_date: "1990-01-01",
        weight_kg: 80,
        height_cm: 180,
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 2,
        coach_id: "1",
        email: "adress@gmail.com",
        first_name: "Jane",
        last_name: "Smith",
        phone: "0690580940",
        gender: "female",
        birth_date: "1990-01-01",
        weight_kg: 80,
        height_cm: 180,
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        coach_id: "1",
        email: "marie.dubois@gmail.com",
        first_name: "Marie",
        last_name: "Dubois",
        phone: "0678451236",
        gender: "female",
        birth_date: "1988-05-15",
        weight_kg: 65,
        height_cm: 165,
        notes: "Objectif : perte de poids et renforcement musculaire",
    },
    {
        id: 4,
        coach_id: "1",
        email: "pierre.martin@gmail.com",
        first_name: "Pierre",
        last_name: "Martin",
        phone: "0645789632",
        gender: "male",
        birth_date: "1995-09-23",
        weight_kg: 75,
        height_cm: 175,
        notes: "Préparation marathon",
    },
    {
        id: 5,
        coach_id: "1",
        email: "sophie.bernard@gmail.com",
        first_name: "Sophie",
        last_name: "Bernard",
        phone: "0698745632",
        gender: "female",
        birth_date: "1992-12-10",
        weight_kg: 58,
        height_cm: 162,
        notes: "Yoga et pilates",
    },
    {
        id: 6,
        coach_id: "1",
        email: "thomas.petit@gmail.com",
        first_name: "Thomas",
        last_name: "Petit",
        phone: "0632145698",
        gender: "male",
        birth_date: "1987-03-28",
        weight_kg: 85,
        height_cm: 182,
        notes: "Musculation",
    },
    {
        id: 7,
        coach_id: "1",
        email: "julie.robert@gmail.com",
        first_name: "Julie",
        last_name: "Robert",
        phone: "0645123789",
        gender: "female",
        birth_date: "1991-07-14",
        weight_kg: 62,
        height_cm: 168,
        notes: "Cross-training",
    },
    {
        id: 8,
        coach_id: "1",
        email: "lucas.moreau@gmail.com",
        first_name: "Lucas",
        last_name: "Moreau",
        phone: "0678912345",
        gender: "male",
        birth_date: "1993-11-05",
        weight_kg: 78,
        height_cm: 178,
        notes: "Cardio et musculation",
    },
    {
        id: 9,
        coach_id: "1",
        email: "emma.durand@gmail.com",
        first_name: "Emma",
        last_name: "Durand",
        phone: "0654789321",
        gender: "female",
        birth_date: "1989-02-18",
        weight_kg: 60,
        height_cm: 170,
        notes: "Remise en forme post-grossesse",
    },
    {
        id: 10,
        coach_id: "1",
        email: "antoine.leroy@gmail.com",
        first_name: "Antoine",
        last_name: "Leroy",
        phone: "0687456321",
        gender: "male",
        birth_date: "1994-06-30",
        weight_kg: 82,
        height_cm: 185,
        notes: "Préparation physique football",
    },
    {
        id: 11,
        coach_id: "1",
        email: "clara.simon@gmail.com",
        first_name: "Clara",
        last_name: "Simon",
        phone: "0698745632",
        gender: "female",
        birth_date: "1996-08-22",
        weight_kg: 55,
        height_cm: 160,
        notes: "Danse et stretching",
    },
    {
        id: 12,
        coach_id: "1",
        email: "maxime.roux@gmail.com",
        first_name: "Maxime",
        last_name: "Roux",
        phone: "0645987123",
        gender: "male",
        birth_date: "1990-04-12",
        weight_kg: 88,
        height_cm: 188,
        notes: "Perte de poids",
    }
]

function ClientsWrapper() {
    return (
        <div className="flex flex-col items-start justify-start w-full h-screen p-6 gap-6">
            <DataTable columns={columns} data={clients} />
        </div>
    );
}

export default ClientsWrapper;