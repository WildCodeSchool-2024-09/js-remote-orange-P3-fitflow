import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import CoursForm from "../forms/CoursForm";
type Cours = {
    id: number;
    coach_id: number;
    current_status: string;
    title: string;
    description_notes: string;
    price: number;
    is_free: boolean;
    start_date: string;
    start_time: string;
    end_time: string;
    location_link: string;
    max_participants: number;
}

type EditCoursDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cours: Cours;
    onCoursUpdate: () => void;
    isTablet: boolean;
}

function EditCoursDialog({ open, onOpenChange, cours, onCoursUpdate, isTablet }: EditCoursDialogProps) {
    const isMobile = useIsMobile();

    return (
        !isMobile ? (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PencilIcon className="w-4 h-4" />
                        {isTablet ? " " : "Modifier"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl gap-6 max-h-[90dvh] overflow-auto">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6 border-b border-gray-200 pb-4">
                        <DialogTitle>Modifier un cours</DialogTitle>
                        <DialogDescription>
                            Modifier un cours de votre liste de cours
                        </DialogDescription>
                    </DialogHeader>
                    <CoursForm
                        onClose={() => {
                            onOpenChange(false);
                            onCoursUpdate();
                        }}
                        mode="edit"
                        cours={cours}
                    />
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button variant="outline">
                        <PencilIcon className="w-4 h-4" />
                        {isTablet ? " " : "Modifier"}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <ScrollArea className="overflow-auto p-4">
                        <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-10">
                            <DrawerTitle>Modifier un cours</DrawerTitle>
                            <DrawerDescription>
                                Modifier un cours de votre liste de cours
                            </DrawerDescription>
                        </DrawerHeader>
                        <CoursForm
                            onClose={() => {
                                onOpenChange(false);
                                onCoursUpdate();
                            }}
                            mode="edit"
                            cours={cours}
                        />
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        )
    );
}

export default EditCoursDialog;