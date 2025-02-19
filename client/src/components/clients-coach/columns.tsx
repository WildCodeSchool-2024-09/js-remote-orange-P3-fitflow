import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type Clients = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
}

export const columns: ColumnDef<Clients>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => {
                    table.toggleAllRowsSelected(!!value);
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                }}
                aria-label="Select row"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            />
        ),
    },
    {
        accessorKey: "first_name",
        header: "Prénom",
        filterFn: "includesString"
    },
    {
        accessorKey: "last_name",
        header: "Nom",
        filterFn: "includesString"
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            return <p>{phone ? `+${phone}` : ""}</p>;
        },
    },
    {
        accessorKey: "gender",
        header: "Genre",
        filterFn: "equals",
        cell: ({ row }) => {
            const gender = row.getValue("gender") as string;
            const displayText = gender === "male" ? "Homme" : "Femme";
            return <Badge variant={gender === "male" ? "default" : "secondary"}>{displayText}</Badge>;
        },
    },
    {
        accessorKey: "birth_date",
        header: "Date de naissance",
        cell: ({ row }) => {
            const birthDate = row.getValue("birth_date") as string;
            return <p>{new Date(birthDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>;
        },
    },
]