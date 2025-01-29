import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "../ui/scroll-area";

interface DeleteClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    numberOfClients: number;
    selectedClientIds: number[];
    onDelete: (ids: number[]) => void;
}

function DeleteClientDialog({
    open,
    onOpenChange,
    numberOfClients,
    selectedClientIds,
    onDelete
}: DeleteClientDialogProps) {
    const isMobile = useIsMobile();

    const handleDelete = () => {
        onDelete(selectedClientIds);
        onOpenChange(false);
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
                    <DialogHeader className="flex flex-col items-start justify-start gap-2">
                        <DialogTitle>{numberOfClients > 1 ? "Supprimer tous les clients" : "Supprimer un client"}</DialogTitle>
                        <DialogDescription>
                            {numberOfClients > 1 ? "Cette action est irréversible. Vous supprimerez tous les clients de votre liste." : "Cette action est irréversible. Vous supprimerez ce client de votre liste."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Supprimer
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
                                onClick={handleDelete}
                            >
                                Supprimer
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