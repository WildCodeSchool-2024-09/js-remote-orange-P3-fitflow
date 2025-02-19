import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkoutsForm from "@/components/forms/WorkoutsForm";

type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

type EditWorkoutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workout: Workout;
    onWorkoutUpdate: () => void;
}

function EditWorkoutDialog({ open, onOpenChange, workout, onWorkoutUpdate }: EditWorkoutDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger>
                    <Button variant="outline">
                        <PencilIcon className="w-4 h-4" />
                        Modifier
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Modifier un workout</DialogTitle>
                    </DialogHeader>
                    <WorkoutsForm
                        onClose={() => {
                            onOpenChange(false);
                            onWorkoutUpdate();
                        }}
                        mode="edit"
                        workout={workout}
                        onWorkoutUpdate={onWorkoutUpdate}
                    />
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
            >
                <DrawerTrigger>
                    <Button>
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-10">
                            <DrawerTitle>Modifier un workout</DrawerTitle>
                            <DrawerDescription>
                                Modifier un workout de votre liste de workouts
                            </DrawerDescription>
                        </DrawerHeader>
                        <WorkoutsForm
                            onClose={() => {
                                onOpenChange(false);
                                onWorkoutUpdate();
                            }}
                            mode="edit"
                            workout={workout}
                            onWorkoutUpdate={onWorkoutUpdate}
                        />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    );
}

export default EditWorkoutDialog;