import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DumbbellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Workout = {
    id: number;
    coach_id: number;
    title: string;
    workout_description: string;
    duration_minutes: number;
    level_of_difficulty: string;
}

function WorkoutsItem({ workout }: { workout: Workout }) {

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

    const navigate = useNavigate();

    return (
        <Card className="cursor-pointer" onClick={() => navigate(`/app/workouts/${workout.id}`)}>
            <CardHeader className="flex flex-col items-start justify-start gap-1 p-4">
                <div className="flex items-center justify-center w-full h-[150px] gap-2 bg-[url('/div.react-flow.svg')] bg-cover bg-center rounded-lg border border-[#EEEFF1]">
                    <div className="flex items-center justify-center w-[50px] h-[50px] bg-[#E5EEFF] border border-[#D6E5FF] rounded-md">
                        <DumbbellIcon className="w-5 h-5 text-[#183C81]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-start gap-3 px-4 pt-2 pb-4">
                <CardTitle className="font-medium">{workout.title}</CardTitle>
                <div className="flex items-center justify-start gap-3">
                    <p className={`text-xs px-2 py-1 rounded-full ${levelColor[workout.level_of_difficulty as keyof typeof levelColor][0]} ${levelColor[workout.level_of_difficulty as keyof typeof levelColor][1]}`}>{levelTranslations[workout.level_of_difficulty as keyof typeof levelTranslations]}</p>
                    <p className="text-xs px-2 py-1 rounded-full bg-[#E5EEFF] text-[#183C81]">{workout.duration_minutes} minutes</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default WorkoutsItem;