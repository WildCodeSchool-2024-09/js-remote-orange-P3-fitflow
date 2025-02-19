import { BadgeEuroIcon, BadgeInfoIcon, CalendarIcon, CaptionsIcon, Clock3Icon, ClockAlertIcon, ContactIcon, MapPinIcon, TextSelectIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "../ui/separator";
type Course = {
    id: number;
    coach_id: number;
    current_status: string;
    title: string;
    description_notes: string;
    price: number;
    is_free: boolean;
    start_date: string;
    start_time: string;
    end_time: string;
    location_link: string;
    max_participants: number;
}

type StatusColors = {
    [key: string]: string[];
}

export default function AsideCoursDetails({ course, isTablet, openDetails }: { course: Course, isTablet: boolean, openDetails: boolean }) {

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

    const formattedDate = format(parseISO(course.start_date), "d MMMM yyyy", { locale: fr });
    const formattedStartTime = format(parseISO(`2000-01-01T${course.start_time}`), "HH'h'mm");
    const formattedEndTime = format(parseISO(`2000-01-01T${course.end_time}`), "HH'h'mm");

    return (
        <aside className={cn("flex flex-col items-start justify-start w-full max-w-lg h-full bg-white border-l border-gray-200", isTablet && openDetails === false ? "hidden" : isTablet && openDetails === true ? "flex max-w-full border-l-0" : "")}>
            <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                <h2>Details</h2>
            </header>
            <div className="flex flex-col items-start justify-start w-full p-6 gap-6">
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <CaptionsIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Titre</p>
                    </div>
                    <p className="text-sm break-words max-w-[200px]">{course.title}</p>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <BadgeInfoIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Statut</p>
                    </div>
                    <Badge className={cn(`text-xs font-medium rounded-full shadow-none hover:${statusColors[course.current_status][0]} hover:${statusColors[course.current_status][1]}`, statusColors[course.current_status][0], statusColors[course.current_status][1])}>
                        {statusTranslations[course.current_status]}
                    </Badge>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <BadgeEuroIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Prix</p>
                    </div>
                    {course.is_free ? (
                        <Badge className={cn("text-xs font-medium rounded-full shadow-none hover:bg-[#DDF9E4] hover:text-[#075A39]", "bg-[#DDF9E4] text-[#075A39]")}>
                            Gratuit
                        </Badge>
                    ) : (
                        <Badge className={cn("text-xs font-medium rounded-full shadow-none hover:bg-[#E5EEFF] hover:text-[#183C81]", "bg-[#E5EEFF] text-[#183C81]")}>
                            {course.price}€
                        </Badge>
                    )}
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Date de début</p>
                    </div>
                    <p className="text-sm">{formattedDate}</p>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <Clock3Icon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Heure de début</p>
                    </div>
                    <p className="text-sm">{formattedStartTime}</p>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <ClockAlertIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Heure de fin</p>
                    </div>
                    <p className="text-sm">{formattedEndTime}</p>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10 whitespace-nowrap">Lien de la localisation</p>
                    </div>
                    <a className="text-sm break-words max-w-[200px] text-blue-500 hover:underline" href={course.location_link} target="_blank" rel="noopener noreferrer">{course.location_link}</a>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <ContactIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Limite de participants</p>
                    </div>
                    <p className="text-sm">{course.max_participants}</p>
                </div>
                <Separator />
                <div className="flex flex-col items-start justify-start w-full gap-6">
                    <div className="flex items-center justify-start w-full gap-3">
                        <TextSelectIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Description</p>
                    </div>
                    <p className="text-sm">{course.description_notes}</p>
                </div>
            </div>
        </aside>
    );
}