import { useState } from "react";
import { usePlanContext } from "@/context/PlanContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

type ServerError = {
    message: string;
    field: string;
}

interface WorkoutsFormProps {
    onClose: () => void;
    workout?: {
        id: number;
        coach_id: number;
        title: string;
        workout_description: string;
        duration_minutes: number;
        level_of_difficulty: string;
    }
    mode: "add" | "edit";
    onWorkoutUpdate: () => void;
}

function WorkoutsForm({ onClose, workout, mode, onWorkoutUpdate }: WorkoutsFormProps) {

    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const [title, setTitle] = useState<string>(workout?.title || "");
    const [workoutDescription, setWorkoutDescription] = useState<string>(workout?.workout_description || "");
    const [durationMinutes, setDurationMinutes] = useState<number | ''>(workout?.duration_minutes || '');
    const [levelOfDifficulty, setLevelOfDifficulty] = useState<string>(workout?.level_of_difficulty || "");
    const { planSubscription } = usePlanContext();
    const isMobile = useIsMobile();
    const { toast } = useToast();
    const { id } = useParams();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerErrors([]);

        const workoutData = {
            coach_id: planSubscription?.coach_id || "",
            title: title,
            workout_description: workoutDescription,
            duration_minutes: durationMinutes,
            level_of_difficulty: levelOfDifficulty,
        };

        const url = mode === "add" ? `${import.meta.env.VITE_API_URL}/app/workouts` : `${import.meta.env.VITE_API_URL}/app/workouts/${id}`;
        const method = mode === "add" ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method: method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.status === 204 || response.status === 201) {
                onWorkoutUpdate();
                onClose();
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Workout {mode === "add" ? "ajouté" : "modifié"}</p>
                                <p className="text-[#016626] font-medium text-xs">Le workout a été {mode === "add" ? "ajouté" : "modifié"} avec succès.</p>
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
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Une erreur est survenue lors de ${mode === "add" ? "l'ajout" : "la modification"} du workout.`,
            });
        }
    }

    return (
        <form
            className={`flex flex-col items-start justify-start gap-6 p-6 ${isMobile ? "px-4" : ""}`}
            onSubmit={onSubmit}
        >
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
                    <p className="text-red-500 text-xs">{serverErrors.find(error => error.field === "title")?.message}</p>
                )}
            </div>
            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-2 w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="level_of_difficulty" className={`${serverErrors.some(error => error.field === "level_of_difficulty") ? "text-red-500" : ""}`}>Niveau de difficulté</Label>
                    <Select
                        value={levelOfDifficulty}
                        onValueChange={(value) => setLevelOfDifficulty(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Niveau de difficulté" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                    </Select>
                    {serverErrors.some(error => error.field === "level_of_difficulty") && (
                        <p className="text-red-500 text-xs">{serverErrors.find(error => error.field === "level_of_difficulty")?.message}</p>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="duration_minutes" className={`${serverErrors.some(error => error.field === "duration_minutes") ? "text-red-500" : ""}`}>Durée</Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5 w-full">
                        <Input
                            id="duration_minutes"
                            className={cn(
                                "-me-px rounded-e-none shadow-none",
                                serverErrors.some(error => error.field === "duration_minutes") &&
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                            )}
                            type="number"
                            placeholder="Durée"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : "")}
                            style={{ appearance: 'none' }}
                        />
                        <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                            minutes
                        </span>
                    </div>
                    {serverErrors.some(error => error.field === "duration_minutes") && (
                        <p className="text-red-500 text-xs">{serverErrors.find(error => error.field === "duration_minutes")?.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
                <Label htmlFor="workout_description" className={`${serverErrors.some(error => error.field === "workout_description") ? "text-red-500" : ""}`}>Notes</Label>
                <Textarea
                    className={cn(
                        "min-h-[200px]",
                        serverErrors.some(error => error.field === "workout_description") &&
                        "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                    )}
                    id="workout_description"
                    placeholder="Notes"
                    value={workoutDescription}
                    onChange={(e) => setWorkoutDescription(e.target.value)}
                />
                {serverErrors.some(error => error.field === "workout_description") && (
                    <p className="text-red-500 text-xs">{serverErrors.find(error => error.field === "workout_description")?.message}</p>
                )}
            </div>
            <div className="flex items-center justify-end gap-2 w-full">
                <Button variant="outline" onClick={onClose}>
                    Annuler
                </Button>
                <Button type="submit">
                    {mode === "add" ? "Ajouter" : "Modifier"}
                </Button>
            </div>
        </form>
    );
}

export default WorkoutsForm;