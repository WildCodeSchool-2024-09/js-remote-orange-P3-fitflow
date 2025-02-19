import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useClientsContext } from "@/context/ClientsContext";
import { Toaster } from "../ui/toaster";

function ClientsWrapper() {
    const { clients } = useClientsContext();

    return (
        <div className="flex flex-col items-start justify-start w-full h-screen p-6 gap-6">
            <Toaster />
            <DataTable columns={columns} data={clients} />
        </div>
    );
}

export default ClientsWrapper;