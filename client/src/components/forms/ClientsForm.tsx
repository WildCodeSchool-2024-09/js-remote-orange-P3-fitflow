import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { PhoneInput } from "../ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fr } from 'date-fns/locale';
import { Textarea } from "../ui/textarea";
import { usePlanContext } from "@/context/PlanContext";
import { useClientsContext } from "@/context/ClientsContext";
import { toast, useToast } from "@/hooks/use-toast";
import { CircleCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type ServerError = {
    message: string;
    field: string;
}

interface ClientsFormProps {
    onClose: () => void;
}

function ClientsForm({ onClose }: ClientsFormProps) {
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [notes, setNotes] = useState<string>("");

    const isMobile = useIsMobile();
    const { planSubscription } = usePlanContext();
    const { fetchClients } = useClientsContext();
    const { toast } = useToast();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerErrors([]);

        const clientData = {
            coach_id: planSubscription?.coach_id || "",
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber.replace(/\D/g, ''),
            gender: gender,
            birth_date: birthDate,
            weight_kg: weight,
            height_cm: height,
            notes: notes.trim()
        };

        // Débogage des données envoyées
        console.log("Données envoyées:", clientData);

        try {
            const response = await fetch("http://localhost:3310/app/clients", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(clientData),
            });

            // Débogage de la réponse
            console.log("Status:", response.status);
            const data = await response.json();
            console.log("Réponse:", data);

            if (response.status === 400) {
                setServerErrors(data.errors);
                return;
            }

            if (response.ok) {
                onClose();
                await fetchClients();
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Client ajouté</p>
                                <p className="text-[#016626] font-medium text-xs">Le client a été ajouté avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de l'ajout du client.",
            });
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className={`flex flex-col items-start justify-start gap-6 p-6 ${isMobile ? "px-4" : ""}`}>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex flex-col sm:flex-row items-start justify-start gap-6 sm:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input
                        id="first-name"
                        type="text"
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="last-name">Nom</Label>
                    <Input
                        id="last-name"
                        type="text"
                        placeholder="Nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start justify-start gap-6 sm:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="phone-number">Téléphone</Label>
                    <PhoneInput
                        className="w-full"
                        id="phone-number"
                        placeholder="Téléphone"
                        defaultCountry="FR"
                        international={true}
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value || '')}
                    />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="gender">Genre</Label>
                    <Select
                        value={gender}
                        onValueChange={(value) => setGender(value || '')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="male">Homme</SelectItem>
                            <SelectItem className="cursor-pointer" value="female">Femme</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="birth-date">Date de naissance</Label>
                <Popover modal={true}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("justify-start text-left font-normal w-full", !birthDate && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? format(new Date(birthDate), "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className=" w-auto p-0">
                        <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={birthDate ? new Date(birthDate) : undefined}
                            onSelect={(birthDate) => setBirthDate(birthDate ? format(birthDate, "yyyy-MM-dd") : '')}
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            locale={fr}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col sm:flex-row items-start justify-start gap-6 sm:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5 w-full">
                        <Input
                            id="weight"
                            type="number"
                            placeholder="69"
                            value={weight}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 3 && (!value || Number(value) > 0)) {
                                    setWeight(value ? Number(value) : "");
                                }
                            }}
                            min="1"
                            max="999"
                            className="-me-px rounded-e-none shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                            kg
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="height">Taille (cm)</Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5 w-full">
                        <Input
                            id="height"
                            type="number"
                            placeholder="173"
                            value={height}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 3 && (!value || Number(value) > 0)) {
                                    setHeight(value ? Number(value) : "");
                                }
                            }}
                            min="1"
                            max="999"
                            className="-me-px rounded-e-none shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                            cm
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    className="h-[150px]"
                    id="notes"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-end w-full gap-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        setEmail("");
                        setFirstName("");
                        setLastName("");
                        setPhoneNumber("");
                        setGender("");
                        setBirthDate("");
                        setWeight("");
                        setHeight("");
                        setNotes("");
                        setServerErrors([]);
                        onClose();
                    }}
                >
                    Annuler
                </Button>
                <Button type="submit">
                    Ajouter
                </Button>
            </div>
            {serverErrors.length > 0 && (
                <Alert
                    className="bg-[#FEEBEB] border-[#FFC9C9]"
                    variant="destructive"
                    hidden={serverErrors.length === 0}>
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {serverErrors.map((error, index) => (
                                <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
}

export default ClientsForm;