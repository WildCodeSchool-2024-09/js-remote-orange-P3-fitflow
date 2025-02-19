import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CircleCheck, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerDescription, DrawerHeader, DrawerContent, DrawerTrigger, DrawerTitle } from "../ui/drawer";
import { toast } from "@/hooks/use-toast";

interface DeleteParticipantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedClientIds: number[];
    onDataChange: () => void;
    table: any;
    coursData: any;
    refreshCoursData: () => Promise<void>;
}

function DeleteParticipantDialog({ open, onOpenChange, selectedClientIds, onDataChange, table, coursData, refreshCoursData }: DeleteParticipantDialogProps) {
    const isMobile = useIsMobile();
    const { id } = useParams();

    const updateCoursStatus = async () => {
        try {
            const coursResponse = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!coursResponse.ok) {
                throw new Error("Erreur lors de la récupération des données du cours");
            }

            const coursData = await coursResponse.json();

            const date = new Date(coursData.start_date);
            const formattedDate = date.toISOString().split('T')[0];

            const updateData = {
                coach_id: Number(coursData.coach_id),
                current_status: "published",
                title: coursData.title,
                description_notes: coursData.description_notes,
                price: Number(coursData.price),
                is_free: Boolean(coursData.is_free),
                start_date: formattedDate,
                start_time: coursData.start_time,
                end_time: coursData.end_time,
                location_link: coursData.location_link,
                max_participants: Number(coursData.max_participants)
            };

            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            if (response.status === 204) {
                // Rafraîchir les données du cours parent
                await refreshCoursData();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la mise à jour du statut du cours.",
            });
        }
    }


    const handleDeleteParticipant = async () => {
        try {
            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: selectedClientIds[0],
                    is_delete_participant: true,
                    is_multiple_delete: false,
                })
            });

            if (response.status === 204) {
                const currentParticipantsCount = table?.getRowModel().rows.length || 0;

                if (currentParticipantsCount === coursData.max_participants) {
                    await updateCoursStatus();
                }

                table.toggleAllRowsSelected(false);
                await refreshCoursData();
                onDataChange();
                onOpenChange(false);

                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Participant supprimé</p>
                                <p className="text-[#016626] font-medium text-xs">Le participant a été supprimé avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            } else {
                const errorData = await response.json();
                onOpenChange(false);
                toast({
                    variant: "destructive",
                    description: errorData.error,
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du participant :", error);
            onOpenChange(false);
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la suppression du participant.",
            });
        }
    }

    const handleMultipleParticipants = async () => {
        try {
            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: selectedClientIds,
                    is_delete_participant: false,
                    is_multiple_delete: true
                })
            })
            if (response.status === 204) {

                table.toggleAllRowsSelected(false);
                onDataChange();
                onOpenChange(false);
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Participants supprimés</p>
                                <p className="text-[#016626] font-medium text-xs">Les participants ont été supprimés avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression des participants :", error);
        }
    }


    return (
        !isMobile ? (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button className="w-full xl:w-fit" variant="destructive">
                        <Trash className="w-4 h-4" />
                        Supprimer
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg gap-6">
                    <DialogHeader className="flex flex-col items-start justify-start gap-2 p-6">
                        <DialogTitle>{selectedClientIds.length > 1 ? "Supprimer tous les participants" : "Supprimer un participant"}</DialogTitle>
                        <DialogDescription>
                            {selectedClientIds.length > 1 ? "Cette action est irréversible. Vous supprimerez tous les participants de ce cours." : "Cette action est irréversible. Vous supprimerez ce participant de ce cours."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-end gap-2 pt-4 pb-6 px-6">
                        <Button
                            variant="destructive"
                            onClick={selectedClientIds.length === 1 ? handleDeleteParticipant : handleMultipleParticipants}
                        >Supprimer</Button>
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
                    <Button className="w-full xl:w-fit" variant="destructive">
                        <Trash className="w-4 h-4" />
                        Supprimer
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-6 gap-6 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
                    <DrawerHeader className="flex flex-col items-start justify-start gap-3 pb-6">
                        <DrawerTitle>{selectedClientIds.length > 1 ? "Supprimer tous les participants" : "Supprimer un participant"}</DrawerTitle>
                        <DrawerDescription className="text-start">
                            {selectedClientIds.length > 1 ? "Cette action est irréversible. Vous supprimerez tous les participants de ce cours." : "Cette action est irréversible. Vous supprimerez ce participant de ce cours."}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex items-center justify-end gap-2 pt-4 pb-6 px-6">
                        <Button
                            variant="destructive"
                            onClick={selectedClientIds.length === 1 ? handleDeleteParticipant : handleMultipleParticipants}
                        >Supprimer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}>Annuler</Button>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    )
}

export default DeleteParticipantDialog;