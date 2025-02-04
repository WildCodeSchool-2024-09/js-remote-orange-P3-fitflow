import ClientsForm from "../forms/ClientsForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Drawer } from "../ui/drawer";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

type Client = {
    id: number;
    coach_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
}

type EditClientDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client;
    onClientUpdate: () => void;
    isTablet: boolean;
}

export function EditClientDialog({ open, onOpenChange, client, onClientUpdate, isTablet }: EditClientDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Pencil className="w-4 h-4" />
                        {isTablet ? "" : "Modifier"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Modifier un client</DialogTitle>
                        <DialogDescription>
                            Modifier un client de votre liste de clients
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="overflow-auto">
                        <ClientsForm
                            onClose={() => {
                                onOpenChange(false);
                                onClientUpdate();
                            }}
                            mode="edit"
                            client={client}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button variant="outline">
                        <Pencil className="w-4 h-4" />
                        {isTablet ? "" : "Modifier"}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-10">
                            <DrawerTitle>Modifier un client</DrawerTitle>
                            <DrawerDescription>
                                Modifier un client de votre liste de clients
                            </DrawerDescription>
                        </DrawerHeader>
                        <ClientsForm
                            onClose={() => {
                                onOpenChange(false);
                                onClientUpdate();
                            }}
                            mode="edit"
                            client={client}
                        />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    );
}