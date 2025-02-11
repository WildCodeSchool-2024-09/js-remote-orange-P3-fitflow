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
import { CircleCheck, PlusIcon, Search } from "lucide-react";
import { Button } from "../ui/button";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useClientsContext } from "@/context/ClientsContext";
import { useParams } from "react-router-dom";
import { Input } from "../ui/input";
import DeleteParticipantDialog from "./DeleteParticipantDialog";
import { toast } from "@/hooks/use-toast";
interface DataTableProps<TData extends { id: number }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onDataChange: () => void
}

export function DataTable<TData extends { id: number }, TValue>({
    columns,
    data,
    onDataChange,
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
                onDataChange();
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
            console.error("Erreur lors de l'ajout du participant :", error);
        }
    }

    return (
        <div className="flex flex-col w-full gap-6">
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
                        <Button className="w-full xl:w-fit" onClick={() => setOpenCommand(true)}>
                            <PlusIcon className="w-4 h-4" />
                            Ajouter un participant
                        </Button>
                        {selectedClientIds.length > 0 && <DeleteParticipantDialog
                            open={openDeleteParticipant}
                            onOpenChange={setOpenDeleteParticipant}
                            selectedClientIds={selectedClientIds}
                            onDataChange={onDataChange}
                            table={table}
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