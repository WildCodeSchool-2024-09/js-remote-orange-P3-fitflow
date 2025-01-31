import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, Trash } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "../ui/scroll-area";
import { useClientsContext } from "@/context/ClientsContext";
import { toast } from "@/hooks/use-toast";

interface DeleteClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    numberOfClients: number;
    selectedClientIds: number[];
    table: any;
}

function DeleteClientDialog({
    open,
    onOpenChange,
    numberOfClients,
    selectedClientIds,
    table
}: DeleteClientDialogProps) {
    const isMobile = useIsMobile();
    const { fetchClients } = useClientsContext();

    const handleDeleteSingleClient = async () => {
        try {
            const response = await fetch("http://localhost:3310/app/clients", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedClientIds[0] })
            });

            if (response.status === 204) {
                table.toggleAllRowsSelected(false);
                await fetchClients();
                onOpenChange(false);
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Client supprimé</p>
                                <p className="text-[#016626] font-medium text-xs">Le client a été supprimé avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la suppression du client.",
            });
        }
    };

    const handleDeleteMultipleClients = async () => {
        try {

            const response = await fetch("http://localhost:3310/app/clients", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedClientIds })
            });

            if (response.status === 204) {
                table.toggleAllRowsSelected(false);
                await fetchClients();
                onOpenChange(false);
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Clients supprimés</p>
                                <p className="text-[#016626] font-medium text-xs">Les clients ont été supprimés avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la suppression des clients.",
            });
        }
    };

    return (
        !isMobile ? (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className={`${numberOfClients === 0 ? "hidden" : ""}`}>
                        <Trash className="w-4 h-4" />
                        Supprimer ({numberOfClients})
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg gap-6">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6">
                        <DialogTitle>{numberOfClients > 1 ? "Supprimer tous les clients" : "Supprimer un client"}</DialogTitle>
                        <DialogDescription>
                            {numberOfClients > 1 ? "Cette action est irréversible. Vous supprimerez tous les clients de votre liste." : "Cette action est irréversible. Vous supprimerez ce client de votre liste."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-end gap-2 pt-4 pb-6 px-6">
                        <Button
                            variant="destructive"
                            onClick={numberOfClients > 1 ? handleDeleteMultipleClients : handleDeleteSingleClient}
                        >
                            {numberOfClients > 1 ? "Supprimer tous" : "Supprimer"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >Annuler</Button>
                    </div>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button
                        variant="destructive"
                        className={`${numberOfClients === 0 ? "hidden" : ""}`}
                    >
                        <Trash className="w-4 h-4" />
                        Supprimer ({numberOfClients})
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-6">
                            <DrawerTitle>{numberOfClients > 1 ? "Supprimer tous les clients" : "Supprimer un client"}</DrawerTitle>
                            <DrawerDescription className="text-start">
                                {numberOfClients > 1 ? "Cette action est irréversible. Vous supprimerez tous les clients de votre liste." : "Cette action est irréversible. Vous supprimerez ce client de votre liste."}
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="flex items-center justify-start gap-2 pt-4 px-4">
                            <Button
                                variant="destructive"
                                onClick={numberOfClients > 1 ? handleDeleteMultipleClients : handleDeleteSingleClient}
                            >
                                {numberOfClients > 1 ? "Supprimer tous" : "Supprimer"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >Annuler</Button>
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    );
}

export default DeleteClientDialog;