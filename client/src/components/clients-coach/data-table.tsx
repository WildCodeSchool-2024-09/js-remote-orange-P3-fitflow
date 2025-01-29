import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
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

import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useState } from "react";
import { AddClientDialog } from "./AddClientDialog"
import DeleteClientDialog from "./DeleteClientDialog";

interface DataTableProps<TData extends { id: number }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onDeleteClients: (ids: number[]) => void
}

export function DataTable<TData extends { id: number }, TValue>({
    columns,
    data,
    onDeleteClients,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
    const [openDeleteClientDialog, setOpenDeleteClientDialog] = useState(false);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            if (columnId === "first_name") {
                const value = String(row.getValue("first_name")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            if (columnId === "last_name") {
                const value = String(row.getValue("last_name")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            if (columnId === "email") {
                const value = String(row.getValue("email")).toLowerCase();
                return value.includes(searchValue) || false;
            }
            return false;
        },
        state: {
            columnFilters,
            globalFilter,
            sorting,
        },
    })

    const navigate = useNavigate();

    const selectedClientIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col lg:flex-row items-start justify-between w-full h-fit gap-4">
                <div className="flex flex-col md:flex-row items-center justify-start w-full h-fit gap-2">
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            type="text"
                            placeholder="Recherchez par nom, prénom ou email"
                            className="pl-10 w-full"
                        />
                    </div>
                    <Select
                        value={(table.getColumn("gender")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) => {
                            const filterValue = value === "all" ? "" : value;
                            table.getColumn("gender")?.setFilterValue(filterValue);
                        }}
                    >
                        <SelectTrigger className="min-w-[100px] w-full md:w-fit">
                            <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="all"
                                className="cursor-pointer"
                            >
                                Tous
                            </SelectItem>
                            <SelectItem
                                value="male"
                                className="cursor-pointer"
                            >
                                Homme
                            </SelectItem>
                            <SelectItem
                                value="female"
                                className="cursor-pointer"
                            >
                                Femme
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-end justify-end w-fit h-fit gap-2">
                    <DeleteClientDialog
                        open={openDeleteClientDialog}
                        onOpenChange={setOpenDeleteClientDialog}
                        numberOfClients={table.getFilteredSelectedRowModel().rows.length}
                        selectedClientIds={selectedClientIds}
                        onDelete={onDeleteClients}
                    />
                    <AddClientDialog
                        open={openAddClientDialog}
                        onOpenChange={setOpenAddClientDialog}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 rounded-md border bg-white">
                <Table className="relative">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap px-4"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        navigate(`/app/clients/${row.original.id}`);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap p-4"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between space-x-2 py-4 gap-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                        Lignes par page
                    </p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                    className="cursor-pointer"
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    )
}