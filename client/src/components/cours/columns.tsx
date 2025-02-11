import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox";

type Cours = {
    id: number;
    title: string;
    description_notes: string;
    price: number;
    start_date: string;
    start_time: string;
    end_time: string;
    location_link: string;
    max_participants: number;
    current_status: string;
    participants: any[];
}

export const columns: ColumnDef<Cours>[] = [
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
        accessorKey: "client_firstname",
        header: "Prénom",
        filterFn: "includesString"
    },
    {
        accessorKey: "client_lastname",
        header: "Nom",
        filterFn: "includesString"
    },
    {
        accessorKey: "client_email",
        header: "Email",
        filterFn: "includesString"
    },
    {
        accessorKey: "client_phone",
        header: "Téléphone",
        cell: ({ row }) => {
            const phone = row.getValue("client_phone") as string;
            return phone ? <span>+{phone}</span> : <span>-</span>;
        }
    },
]
