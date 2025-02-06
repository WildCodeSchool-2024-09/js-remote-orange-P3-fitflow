import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, TrashIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCoursContext } from "@/context/CoursContext";
import { toast } from "@/hooks/use-toast";


type DeleteCoursDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isTablet: boolean;
}

function DeleteCoursDialog({ open, onOpenChange, isTablet }: DeleteCoursDialogProps) {
    const isMobile = useIsMobile();
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchCours } = useCoursContext();


    const handleDeleteCours = async () => {
        try {
            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });

            if (response.status === 204) {
                navigate("/app/cours");
                await fetchCours();
                onOpenChange(false);
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Cours supprimé</p>
                                <p className="text-[#016626] font-medium text-xs">Le cours a été supprimé avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            onOpenChange(false);
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la suppression du cours.",
            });
        }
    }

    return (
        !isMobile ? (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <TrashIcon className="w-4 h-4" />
                        {isTablet ? " " : "Supprimer"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg gap-6">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6">
                        <DialogTitle>Supprimer le cours</DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible. Vous supprimerez ce cours définitivement et vos clients ne pourront plus accéder à ce cours. Vos clients seront notifiés par e-mail.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-end gap-2 pt-4 pb-6 px-6">
                        <Button variant="destructive" onClick={handleDeleteCours}>Supprimer</Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    </div>
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    <Button variant="destructive">
                        <TrashIcon className="w-4 h-4" />
                        {isTablet ? " " : "Supprimer"}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <DrawerHeader className="flex flex-col items-start justify-start gap-2 p-6">
                        <DrawerTitle>Supprimer le cours</DrawerTitle>
                        <DrawerDescription className="text-start">
                            Cette action est irréversible. Vous supprimerez ce cours définitivement et vos clients ne pourront plus accéder à ce cours. Vos clients seront notifiés par e-mail.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex items-center justify-start gap-2 pt-4 px-4">
                        <Button variant="destructive" onClick={handleDeleteCours}>Supprimer</Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    );
}

export default DeleteCoursDialog;