import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

function AsideWorkoutDetails({ workout }: { workout: Workout }) {

    const levelColor = {
        "beginner": ["bg-[#DDF9E4]", "text-[#075A39]"],
        "intermediate": ["bg-[#F4FBCB]", "text-[#505F07]"],
        "advanced": ["bg-[#FEEEE1]", "text-[#753501]"],
    }

    const levelTranslations = {
        "beginner": "Débutant",
        "intermediate": "Intermédiaire",
        "advanced": "Avancé",
    }

    return (
        <aside className="flex flex-col items-start justify-start w-full max-w-lg h-full bg-white border-l border-gray-200">
            <header className="flex flex-col items-start justify-start w-full p-6 gap-4 border-b border-gray-200">
                <h1 className="text-base font-medium">{workout.title}</h1>
                <div className="flex items-center justify-start gap-3">
                    <p className={`text-xs px-2 py-1 rounded-full ${levelColor[workout.level_of_difficulty as keyof typeof levelColor][0]} ${levelColor[workout.level_of_difficulty as keyof typeof levelColor][1]}`}>{levelTranslations[workout.level_of_difficulty as keyof typeof levelTranslations]}</p>
                    <p className="text-xs px-2 py-1 rounded-full bg-[#E5EEFF] text-[#183C81]">{workout.duration_minutes} minutes</p>
                </div>
                <p className="text-sm text-gray-500">{workout.workout_description}</p>
            </header>
            <div className="flex flex-col items-start justify-start w-full p-6 gap-6">
                <div className="flex items-center justify-between w-full gap-3">
                    <h2 className="text-base font-medium">Exercices</h2>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}

export default AsideWorkoutDetails;