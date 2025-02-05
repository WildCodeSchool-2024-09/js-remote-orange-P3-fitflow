import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CoursForm from "@/components/forms/CoursForm";

interface AddCoursDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function AddCoursDialog({ open, onOpenChange }: AddCoursDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4" />
                        Ajouter un cours
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Ajouter un cours</DialogTitle>
                        <DialogDescription>
                            Ajouter un cours à votre liste de cours
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="overflow-auto">
                        <CoursForm onClose={() => onOpenChange(false)} mode="add" />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
            >
                <DrawerTrigger asChild>
                    <Button className="w-full">
                        <Plus className="w-4 h-4" />
                        Ajouter un cours
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-10">
                            <DrawerTitle>Ajouter un cours</DrawerTitle>
                            <DrawerDescription>
                                Ajouter un cours à votre liste de cours
                            </DrawerDescription>
                        </DrawerHeader>
                        <CoursForm onClose={() => onOpenChange(false)} mode="add" />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    )
}

export default AddCoursDialog;