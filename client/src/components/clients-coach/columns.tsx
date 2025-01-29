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
                    setTimeout(() => {
                        console.log("Lignes sélectionnées:", table.getSelectedRowModel().rows.map(row => row.original));
                    }, 0);
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row, table }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                    setTimeout(() => {
                        console.log("Lignes sélectionnées:", table.getSelectedRowModel().rows.map(row => row.original));
                    }, 0);
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
    },
    {
        accessorKey: "gender",
        header: "Sexe",
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
    },
]