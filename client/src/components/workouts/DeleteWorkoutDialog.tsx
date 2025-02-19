import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, TrashIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type DeleteWorkoutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DeleteWorkoutDialog({ open, onOpenChange }: DeleteWorkoutDialogProps) {
    const isMobile = useIsMobile();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDeleteWorkout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/app/workouts/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.status === 204) {
                onOpenChange(false);
                navigate("/app/workouts");
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Workout supprimé</p>
                                <p className="text-[#016626] font-medium text-xs">Le workout a été supprimé avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
                return;
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Une erreur est survenue lors de la suppression du workout.`,
            });
        }
    }


    return (
        !isMobile ? (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <TrashIcon className="w-4 h-4" />
                        Supprimer
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg gap-6">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6">
                        <DialogTitle>Supprimer le workout</DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible. Vous supprimerez ce workout définitivement et vos clients ne pourront plus accéder à ce workout. Vos clients seront notifiés par e-mail.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex items-center justify-end gap-2 pt-4 pb-6 px-6">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDeleteWorkout}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button variant="destructive">
                        <TrashIcon className="w-4 h-4" />
                        Supprimer
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Supprimer le workout</DrawerTitle>
                    </DrawerHeader>
                    <DrawerDescription>
                        Êtes-vous sr de vouloir supprimer ce workout ?
                    </DrawerDescription>
                    <DrawerFooter>
                        <Button variant="outline">Annuler</Button>
                        <Button variant="destructive">Supprimer</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    );
}

export default DeleteWorkoutDialog;