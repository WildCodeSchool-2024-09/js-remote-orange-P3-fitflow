import { useState } from "react";
import { usePlanContext } from "@/context/PlanContext";
import { useCoursContext } from "@/context/CoursContext";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, CircleCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

type ServerError = {
    message: string;
    field: string;
}

interface CoursFormProps {
    onClose: () => void;
    cours?: {
        id: number;
        coach_id: number;
        title: string;
        current_status: string;
        description_notes: string;
        price: number;
        is_free: boolean;
        start_date: string;
        start_time: string;
        end_time: string;
        location_link: string;
        max_participants: number;
    };
    mode: "add" | "edit";
}

function CoursForm({ onClose, cours, mode }: CoursFormProps) {
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const [title, setTitle] = useState<string>(cours?.title || "");
    const [currentStatus, setCurrentStatus] = useState<string>(cours?.current_status || "");
    const [descriptionNotes, setDescriptionNotes] = useState<string>(cours?.description_notes || "");
    const [price, setPrice] = useState<number | ''>(cours?.price || '');
    const [isFree, setIsFree] = useState<boolean>(cours?.is_free || false);
    const [startDate, setStartDate] = useState<string>(cours?.start_date || "");
    const [startTime, setStartTime] = useState<string>(cours?.start_time || "");
    const [endTime, setEndTime] = useState<string>(cours?.end_time || "");
    const [locationLink, setLocationLink] = useState<string>(cours?.location_link || "");
    const [maxParticipants, setMaxParticipants] = useState<number | ''>(cours?.max_participants || '');

    const { planSubscription } = usePlanContext();
    const { fetchCours } = useCoursContext();
    const { id } = useParams();
    const { toast } = useToast();
    const isMobile = useIsMobile();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerErrors([]);

        const formattedStartDate = startDate ? startDate.split('T')[0] : '';
        const formattedStartTime = startTime ? startTime.split('T')[0] : '';
        const formattedEndTime = endTime ? endTime.split('T')[0] : '';

        const coursData = {
            coach_id: planSubscription?.coach_id || "",
            title: title,
            current_status: currentStatus,
            description_notes: descriptionNotes,
            price: price,
            is_free: isFree,
            start_date: formattedStartDate,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            location_link: locationLink,
            max_participants: maxParticipants,
        };

        const url = mode === "add" ? "http://localhost:3310/app/cours" : `http://localhost:3310/app/cours/${id}`;
        const method = mode === "add" ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method: method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(coursData),
            });

            if (response.status === 204) {
                onClose();
                await fetchCours();
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Client {mode === "add" ? "ajouté" : "modifié"}</p>
                                <p className="text-[#016626] font-medium text-xs">Le client a été {mode === "add" ? "ajouté" : "modifié"} avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
                return;
            }

            const data = await response.json();
            if (response.status === 400) {
                setServerErrors(data.errors);
                return;
            }

            if (response.status === 201) {
                onClose();
                await fetchCours();
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Cours {mode === "add" ? "ajouté" : "modifié"}</p>
                                <p className="text-[#016626] font-medium text-xs">Le cours a été {mode === "add" ? "ajouté" : "modifié"} avec succès.</p>
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
                description: `Une erreur est survenue lors de ${mode === "add" ? "l'ajout" : "la modification"} du client.`,
            });
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className={`flex flex-col items-start justify-start gap-6 p-6 ${isMobile ? "px-4" : ""}`}>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="title" className={`${serverErrors.some(error => error.field === "title") ? "text-red-500" : ""}`}>Titre</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={cn(
                        serverErrors.some(error => error.field === "title") &&
                        "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                    )}
                />
                {serverErrors.some(error => error.field === "title") && (
                    <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "title")?.message}</p>
                )}
            </div>
            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="status" className={`${serverErrors.some(error => error.field === "current_status") ? "text-red-500" : ""}`}>Statut</Label>
                    <Select
                        value={currentStatus}
                        onValueChange={(value) => setCurrentStatus(value || '')}
                    >
                        <SelectTrigger
                            className={cn(
                                serverErrors.some(error => error.field === "current_status") &&
                                "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="draft">Brouillon</SelectItem>
                            <SelectItem className="cursor-pointer" value="published">Publié</SelectItem>
                            <SelectItem className="cursor-pointer" value="full">Complet</SelectItem>
                            <SelectItem className="cursor-pointer" value="finished">Terminé</SelectItem>
                            <SelectItem className="cursor-pointer" value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                    </Select>
                    {serverErrors.some(error => error.field === "current_status") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "current_status")?.message}</p>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="location_link" className={`${serverErrors.some(error => error.field === "location_link") ? "text-red-500" : ""}`}>Lien de l'adresse</Label>
                    <div className="flex w-full rounded-lg shadow-sm shadow-black/5">
                        <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                            https://
                        </span>
                        <Input
                            id="location_link"
                            type="text"
                            placeholder="maps.google.com/... ou maps.app.goo.gl/..."
                            value={locationLink}
                            onChange={(e) => setLocationLink(e.target.value)}
                            className={cn(
                                serverErrors.some(error => error.field === "location_link") ?
                                    "-mb-px rounded-s-none shadow-none border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500" :
                                    "-ms-px rounded-s-none shadow-none"
                            )}
                        />
                    </div>
                    {serverErrors.some(error => error.field === "location_link") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "location_link")?.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="price" className={`${serverErrors.some(error => error.field === "price") && isFree === false ? "text-red-500" : ""}`}>Prix</Label>
                <div className="relative flex w-full rounded-lg shadow-sm shadow-black/5">
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground">
                        €
                    </span>
                    <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className={cn(
                            serverErrors.some(error => error.field === "price") && isFree === false ?
                                "-me-px rounded-e-none ps-6 shadow-none border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500" :
                                "-me-px rounded-e-none ps-6 shadow-none",
                            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        )}
                        disabled={isFree}
                    />
                    <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                        EUR
                    </span>
                </div>
                {serverErrors.some(error => error.field === "price") && isFree === false && (
                    <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "price")?.message}</p>
                )}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="is_free"
                        checked={isFree}
                        onCheckedChange={(checked) => {
                            setIsFree(checked);
                            if (checked) {
                                setPrice(0);
                            }
                        }}
                    />
                    <Label htmlFor="is_free" className="text-sm font-normal cursor-pointer">
                        Cours gratuit
                    </Label>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="max_participants" className={`${serverErrors.some(error => error.field === "max_participants") ? "text-red-500" : ""}`}>Nombre de participants maximum</Label>
                    <Input
                        id="max_participants"
                        type="number"
                        placeholder="0"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value === '' ? '' : Number(e.target.value))}
                        className={cn(
                            serverErrors.some(error => error.field === "max_participants") &&
                            "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        )}
                    />
                    {serverErrors.some(error => error.field === "max_participants") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "max_participants")?.message}</p>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="start_date" className={`${serverErrors.some(error => error.field === "start_date") ? "text-red-500" : ""}`}>Date de début</Label>
                    <Popover modal={true}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("justify-start text-left font-normal w-full", !startDate && "text-muted-foreground",
                                    serverErrors.some(error => error.field === "start_date") &&
                                    "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(new Date(startDate), "PPP", { locale: fr }) : <span>Choisir une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className=" w-auto p-0">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                selected={startDate ? new Date(startDate) : undefined}
                                onSelect={(startDate) => setStartDate(startDate ? format(startDate, "yyyy-MM-dd") : '')}
                                fromYear={2025}
                                toYear={2050}
                                locale={fr}
                            />
                        </PopoverContent>
                    </Popover>
                    {serverErrors.some(error => error.field === "start_date") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "start_date")?.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="start_time" className={`${serverErrors.some(error => error.field === "start_time") ? "text-red-500" : ""}`}>Heure de début</Label>
                    <Input
                        id="start_time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={cn(
                            serverErrors.some(error => error.field === "start_time") ?
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500 [&::-webkit-calendar-picker-indicator]:hidden [-webkit-appearance:none] [appearance:none]" :
                                "[&::-webkit-calendar-picker-indicator]:hidden [-webkit-appearance:none] [appearance:none]"
                        )}
                    />
                    {serverErrors.some(error => error.field === "start_time") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "start_time")?.message}</p>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="end_time" className={`${serverErrors.some(error => error.field === "end_time") ? "text-red-500" : ""}`}>Heure de fin</Label>
                    <Input
                        id="end_time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={cn(
                            serverErrors.some(error => error.field === "end_time") ?
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500 [&::-webkit-calendar-picker-indicator]:hidden [-webkit-appearance:none] [appearance:none]" :
                                "[&::-webkit-calendar-picker-indicator]:hidden [-webkit-appearance:none] [appearance:none]"
                        )}
                    />
                    {serverErrors.some(error => error.field === "end_time") && (
                        <p className="text-xs text-red-500">{serverErrors.find(error => error.field === "end_time")?.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="description_notes">Description</Label>
                <Textarea
                    className="h-[100px]"
                    id="description_notes"
                    value={descriptionNotes}
                    onChange={(e) => setDescriptionNotes(e.target.value)}
                />
            </div>
            <div className="flex items-end justify-end gap-2 w-full">
                <Button type="button" variant={"outline"} onClick={onClose}>Annuler</Button>
                <Button type="submit">
                    {mode === "add" ? "Ajouter" : "Modifier"}
                </Button>
            </div>
            {serverErrors.length > 0 && (
                <Alert
                    className="bg-[#FEEBEB] border-[#FFC9C9]"
                    variant="destructive"
                    hidden={serverErrors.length === 0}>
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Nous sommes désolés, mais quelque chose s'est mal passé lors de la création du cours. Veuillez réessayer.
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
}

export default CoursForm;