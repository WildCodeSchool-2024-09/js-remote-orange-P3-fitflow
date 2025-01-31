import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile";
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Drawer } from "../ui/drawer";
import ClientsForm from "../forms/ClientsForm";
import { ScrollArea } from "../ui/scroll-area";

interface AddClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4" />
                        Ajouter un client
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Ajouter un client</DialogTitle>
                        <DialogDescription>
                            Ajouter un client à votre liste de clients
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="overflow-auto">
                        <ClientsForm onClose={() => onOpenChange(false)} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4" />
                        Ajouter un client
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-10">
                            <DrawerTitle>Ajouter un client</DrawerTitle>
                            <DrawerDescription>
                                Ajouter un client à votre liste de clients
                            </DrawerDescription>
                        </DrawerHeader>
                        <ClientsForm onClose={() => onOpenChange(false)} />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    )
} 