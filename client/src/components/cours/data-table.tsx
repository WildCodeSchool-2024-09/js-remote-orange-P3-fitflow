import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { CircleCheck, PlusIcon, Search, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useClientsContext } from "@/context/ClientsContext";
import { useParams } from "react-router-dom";
import { Input } from "../ui/input";
import DeleteParticipantDialog from "./DeleteParticipantDialog";
import { toast } from "@/hooks/use-toast";

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
    participants: any[];
}

interface DataTableProps<TData extends { id: number; max_participants: number }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onDataChange: () => void
    maxParticipants: number
    cours: Cours
    refreshCoursData: () => Promise<void>
}

export function DataTable<TData extends { id: number; max_participants: number }, TValue>({
    columns,
    data,
    onDataChange,
    maxParticipants,
    cours,
    refreshCoursData,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [openCommand, setOpenCommand] = useState(false);
    const [openDeleteParticipant, setOpenDeleteParticipant] = useState(false);
    const { id } = useParams();
    const { clients } = useClientsContext();

    const coursParticipants = data.map((row: any) => row.client_id);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            if (columnId === "client_firstname") {
                const value = String(row.getValue("client_firstname")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            if (columnId === "client_lastname") {
                const value = String(row.getValue("client_lastname")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            if (columnId === "client_email") {
                const value = String(row.getValue("client_email")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            return false;
        },
        state: {
            globalFilter,
        }
    });

    const selectedClientIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as any).client_id);

    const updateCoursStatus = async () => {
        try {
            const coursResponse = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!coursResponse.ok) {
                throw new Error("Erreur lors de la récupération des données du cours");
            }

            const coursData = await coursResponse.json();

            const date = new Date(coursData.start_date);
            const formattedDate = date.toISOString().split('T')[0];

            const updateData = {
                coach_id: Number(coursData.coach_id),
                current_status: "full",
                title: coursData.title,
                description_notes: coursData.description_notes,
                price: Number(coursData.price),
                is_free: Boolean(coursData.is_free),
                start_date: formattedDate,
                start_time: coursData.start_time,
                end_time: coursData.end_time,
                location_link: coursData.location_link,
                max_participants: Number(coursData.max_participants)
            };

            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            if (response.status === 204) {
                // Rafraîchir les données du cours parent
                await refreshCoursData();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la mise à jour du statut du cours.",
            });
        }
    }

    const addParticipant = async (clientId: number) => {
        try {
            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ client_id: clientId }),
            });

            if (response.status === 201) {
                // Vérifier si le cours est maintenant complet
                if (data.length + 1 >= cours.max_participants) {
                    await updateCoursStatus();
                }
                // Forcer un rafraîchissement immédiat des données
                onDataChange();
                // Recharger les données du cours spécifique
                const coursResponse = await fetch(`http://localhost:3310/app/cours/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (coursResponse.ok) {
                    onDataChange();
                }

                setOpenCommand(false);

                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Participant ajouté</p>
                                <p className="text-[#016626] font-medium text-xs">Le participant a été ajouté avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de l'ajout du participant.",
            });
        }
    }

    return (
        <div className="flex flex-col w-full gap-6">
            {cours?.max_participants <= data.length && (
                <div className="flex items-center justify-start w-full h-fit gap-2 py-2 px-3 bg-[#fff4cf] rounded-md">
                    <TriangleAlert className="w-4 h-4 text-[#aa4d00]" />
                    <p className="text-sm text-[#aa4d00]">Votre cours est complet.</p>
                </div>
            )}
            <div className="flex flex-col items-start justify-between w-full h-fit gap-4">
                <div className="flex flex-col items-start justify-between w-full h-fit gap-2 xl:flex-row">
                    <div className="relative w-full xl:max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            type="text"
                            placeholder="Recherchez par nom, prénom ou email"
                            className="pl-10 w-full"
                        />
                    </div>
                    <div className="flex flex-col xl:flex-row items-end justify-end w-full xl:w-fit h-fit gap-2">
                        {data.length < maxParticipants && (
                            <Button className="w-full xl:w-fit" onClick={() => setOpenCommand(true)}>
                                <PlusIcon className="w-4 h-4" />
                                Ajouter un participant
                            </Button>
                        )}
                        {selectedClientIds.length > 0 && <DeleteParticipantDialog
                            open={openDeleteParticipant}
                            onOpenChange={setOpenDeleteParticipant}
                            selectedClientIds={selectedClientIds}
                            onDataChange={onDataChange}
                            table={table}
                            coursData={cours}
                            refreshCoursData={refreshCoursData}
                        />}
                    </div>
                </div>
                <div className="grid grid-cols-1 w-full rounded-md border bg-white">
                    <Table className="relative">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap px-4">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="whitespace-nowrap p-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Aucun résultat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Recherchez des clients" />
                <CommandList>
                    {clients?.map((client) => (
                        coursParticipants.includes(client.id) ? null : <CommandItem key={client.id} className="flex items-center gap-2 cursor-pointer"
                        >
                            {client.first_name} {client.last_name}
                            <Button
                                variant="outline"
                                size="icon"
                                className="ml-auto w-fit h-fit p-1"
                                onClick={() => {
                                    addParticipant(client.id);
                                }}
                            >
                                <PlusIcon className="w-2 h-2" />
                            </Button>
                        </CommandItem>
                    ))}
                    <CommandEmpty>
                        Aucun clients trouvé
                    </CommandEmpty>
                </CommandList>
            </CommandDialog>
        </div>
    )
}