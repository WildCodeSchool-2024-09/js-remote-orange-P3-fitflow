import { useEffect, useState } from "react";
import { usePlanContext } from "@/context/PlanContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "@/hooks/use-toast";
import { CircleCheck } from "lucide-react";

type ServerError = {
    message: string;
    field: string;
}

function ProfilForm() {
    const { coach, planSubscription, setCoach } = usePlanContext();
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const [email, setEmail] = useState<string>(coach?.email || "");
    const [lastName, setLastName] = useState<string>(coach?.last_name || "");
    const [firstName, setFirstName] = useState<string>(coach?.first_name || "");
    const [phoneNumber, setPhoneNumber] = useState<string>(coach?.phone_number ? `+${coach.phone_number}` : "");
    const [speciality, setSpeciality] = useState<string>(coach?.speciality || "");
    const [bio, setBio] = useState<string>(coach?.bio || "");
    const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(
        coach?.profile_picture ? `http://localhost:3310/imageUpload/${coach.profile_picture}` : "/placeholder-avatar.png"
    );

    useEffect(() => {
        setEmail(coach?.email || "");
        setLastName(coach?.last_name || "");
        setFirstName(coach?.first_name || "");
        setPhoneNumber(coach?.phone_number ? `+${coach.phone_number}` : "");
        setSpeciality(coach?.speciality || "");
        setBio(coach?.bio || "");
        setSelectedFile([]);
        setImagePreview(coach?.profile_picture ? `http://localhost:3310/imageUpload/${coach.profile_picture}` : "/placeholder-avatar.png");
    }, [coach]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerErrors([]);

        if (!selectedFile) {
            setServerErrors([{ field: "file", message: "Veuillez sélectionner une image" }]);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile[0]);

        // Ajout des autres données au FormData
        formData.append('id', planSubscription?.coach_id.toString() || "");
        formData.append('user_id', coach?.user_id.toString() || "");
        formData.append('last_name', lastName);
        formData.append('first_name', firstName);
        formData.append('phone_number', phoneNumber.replace(/\D/g, ''));
        formData.append('speciality', speciality);
        formData.append('bio', bio);

        const response = await fetch("http://localhost:3310/app/profil", {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (response.status === 400) {
            const data = await response.json();
            setServerErrors(data.errors);
            return;
        }

        if (response.status === 200) {
            const data = await response.json();
            console.log(data);

            // Mettre à jour le coach avec toutes les données
            const updatedCoach = {
                ...coach!,
                last_name: lastName,
                first_name: firstName,
                phone_number: phoneNumber.replace(/\D/g, ''),
                speciality: speciality,
                bio: bio,
                profile_picture: data.profile_picture,
                email: email
            };

            setCoach(updatedCoach);
            console.log(coach);

            // Mettre à jour l'aperçu de l'image
            if (data.profile_picture) {
                setImagePreview(coach?.profile_picture ? `http://localhost:3310/imageUpload/${coach.profile_picture}` : "/placeholder-avatar.png");
            }

            toast({
                description: (
                    <div className="flex items-start gap-1">
                        <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                        <div className="flex flex-col items-start gap-1 pl-2">
                            <p className="text-[#016626] font-medium text-sm">Profil mis à jour</p>
                            <p className="text-[#016626] font-medium text-xs">Vos informations ont été mises à jour avec succès.</p>
                        </div>
                    </div>
                ),
                className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
            });
        } else {
            // Ajout d'un toast d'erreur
            toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la mise à jour du profil.",
            });
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="w-full flex flex-col gap-12">
            <div className="flex items-center justify-start gap-10 w-full">
                <img
                    className="w-[96px] h-[96px] object-cover rounded-full"
                    src={`http://localhost:3310/imageUpload/${coach?.profile_picture}`}
                    alt="avatar"
                />
                <div className="flex flex-col gap-2">
                    <Input
                        className="flex items-center justify-center p-3 h-[48px] w-[300px] border-dashed border-2 border-gray-200 rounded-md cursor-pointer"
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.size <= 10 * 1024 * 1024) { // 10MB
                                setSelectedFile([file]);
                                setImagePreview(URL.createObjectURL(file));
                            } else {
                                toast({
                                    variant: "destructive",
                                    description: "Le fichier doit être inférieur à 10MB",
                                });
                            }
                        }}
                    />
                    <p className="text-sm text-gray-500 font-light">
                        Nous supportons les PNG, JPEG et GIF inférieurs à 10MB
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <Label>
                    Email
                </Label>
                <Input
                    value={email}
                    placeholder="Email"
                    disabled
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-start gap-6 w-full">
                <div className="flex flex-col gap-3 w-full">
                    <Label>
                        Nom
                    </Label>
                    <Input
                        value={lastName}
                        placeholder="Nom"
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <Label>
                        Prénom
                    </Label>
                    <Input
                        value={firstName}
                        placeholder="Prénom"
                        onChange={e => setFirstName(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center justify-start gap-6 w-full">
                <div className="flex flex-col gap-3 w-full">
                    <Label>
                        Téléphone
                    </Label>
                    <PhoneInput
                        value={phoneNumber}
                        defaultCountry="FR"
                        international={true}
                        onChange={(value) => setPhoneNumber(value || '')}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <Label>
                        Spécialité
                    </Label>
                    <Input
                        value={speciality}
                        placeholder="Spécialité"
                        onChange={e => setSpeciality(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <Label>
                    Bio
                </Label>
                <Textarea
                    className="h-[100px]"
                    value={bio}
                    placeholder="Bio"
                    onChange={e => setBio(e.target.value)}
                />
            </div>
            {serverErrors.length > 0 && (
                <Alert
                    className="bg-[#FEEBEB] border-[#FFC9C9]"
                    variant="destructive"
                    hidden={serverErrors.length === 0}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="rgba(239,68,68,1)"
                    >
                        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z">
                        </path>
                    </svg>
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        {serverErrors.map((error, index) => (
                            <p key={index}>{error.message}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
            <Button
                className="w-full"
                type="submit">
                Enregistrer
            </Button>
        </form>
    );
}

export default ProfilForm;