import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkoutsForm from "@/components/forms/WorkoutsForm";

interface AddWorkoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onWorkoutUpdate: () => void;
}

function AddWorkoutDialog({ open, onOpenChange, onWorkoutUpdate }: AddWorkoutDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger>
                    <Button>
                        <Plus className="w-4 h-4" />
                        Ajouter un workout
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Ajouter un workout</DialogTitle>
                        <DialogDescription>
                            Ajouter un workout à votre liste de workouts
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="overflow-auto">
                        <WorkoutsForm onClose={() => onOpenChange(false)} mode="add" onWorkoutUpdate={onWorkoutUpdate} />
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
                        Ajouter un workout
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="w-full max-w-4xl gap-6 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                            <DrawerTitle>Ajouter un workout</DrawerTitle>
                            <DrawerDescription className="text-start">
                                Ajouter un workout à votre liste de workouts
                            </DrawerDescription>
                        </DrawerHeader>
                        <WorkoutsForm onClose={() => onOpenChange(false)} mode="add" onWorkoutUpdate={onWorkoutUpdate} />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    )
}

export default AddWorkoutDialog;