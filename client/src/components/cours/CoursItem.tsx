import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { ContactIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

type Cours = {
    id: number;
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
    participants_count: number;
}

type StatusColors = {
    [key: string]: string[];
}

const statusColors: StatusColors = {
    draft: ["bg-[#F4F5F6]", "text-[#5C5E63]"],
    published: ["bg-[#DDF9E4]", "text-[#075A39]"],
    full: ["bg-[#E5EEFF]", "text-[#183C81]"],
    finished: ["bg-[#F4FBCB]", "text-[#505F07]"],
    cancelled: ["bg-[#FEEEE1]", "text-[#753501]"]
}

const statusTranslations: { [key: string]: string } = {
    draft: "Brouillon",
    published: "Publié",
    full: "Complet",
    finished: "Terminé",
    cancelled: "Annulé"
}

function CoursItem({ cours }: { cours: Cours }) {
    const formattedDate = format(parseISO(cours.start_date), "d MMMM yyyy", { locale: fr });
    const formattedStartTime = format(parseISO(`2000-01-01T${cours.start_time}`), "HH'h'mm");
    const formattedEndTime = format(parseISO(`2000-01-01T${cours.end_time}`), "HH'h'mm");

    const navigate = useNavigate();

    const handleLocationClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card
            onClick={() => navigate(`/app/cours/${cours.id}`)}
            className="w-full h-full cursor-pointer hover:shadow-md transition-all duration-300">
            <header className="flex flex-row items-center justify-between p-3">
                <Badge className={cn(`text-xs font-medium rounded-full shadow-none hover:${statusColors[cours.current_status][0]} hover:${statusColors[cours.current_status][1]}`, statusColors[cours.current_status][0], statusColors[cours.current_status][1])}>
                    {statusTranslations[cours.current_status]}
                </Badge>
                <div className="flex flex-row items-center justify-center gap-2">
                    <ContactIcon className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">{cours?.participants_count || 0}/{cours.max_participants}</p>
                </div>

            </header>
            <CardContent className="p-3">
                <CardTitle className="text-sm font-medium">{cours.title}</CardTitle>
                <CardDescription>{cours.description_notes}</CardDescription>
                <div className="flex flex-row items-center justify-between pt-4">
                    <p className="text-xs text-gray-500">
                        {formattedDate} - {formattedStartTime} à {formattedEndTime}
                    </p>

                </div>
                <div className="flex flex-row items-center justify-between pt-4">
                    <a
                        href={cours.location_link}
                        target="_blank"
                        onClick={handleLocationClick}
                        className="text-xs text-blue-500 underline hover:text-blue-700 transition-all duration-300"
                    >
                        Voir la localisation
                    </a>
                </div>
                <div className="flex flex-row items-center justify-between pt-4">
                    {cours.is_free ? (
                        <Badge className={cn("text-xs font-medium rounded-full shadow-none hover:bg-[#DDF9E4] hover:text-[#075A39]", "bg-[#DDF9E4] text-[#075A39]")}>
                            Gratuit
                        </Badge>
                    ) : (
                        <Badge className={cn("text-xs font-medium rounded-full shadow-none hover:bg-[#E5EEFF] hover:text-[#183C81]", "bg-[#E5EEFF] text-[#183C81]")}>
                            {cours.price}€
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default CoursItem;