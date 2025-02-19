import AsideCoursDetails from "./AsideCoursDetails";
import CoursSubscriptions from "./CoursSubscriptions";
import EditCoursDialog from "./EditCoursDialog";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useParams } from "react-router-dom";
import DeleteCoursDialog from "./DeleteCoursDialog";
import { Button } from "@/components/ui/button";
import { ListCollapseIcon, XIcon } from "lucide-react";
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


export default function CoursDetailsWrapper({ course }: { course: Course }) {
    const [openEditCoursDialog, setOpenEditCoursDialog] = useState<boolean>(false);
    const [openDeleteCoursDialog, setOpenDeleteCoursDialog] = useState<boolean>(false);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1025);
    const [courseData, setCourseData] = useState<Course>(course);
    const { id } = useParams();

    const refreshCoursData = async () => {
        try {
            const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            setCourseData(data);
        } catch (error) {
            console.error("Erreur lors du rafraîchissement des données:", error);
        }
    };

    useEffect(() => {
        refreshCoursData();
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            setIsTablet(window.innerWidth < 1025);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col items-start justify-start w-full h-screen">
            <Toaster />
            <header className="flex items-center justify-between w-full py-4 px-6 border-b border-gray-200">
                <h2 className="text-sm font-medium">{courseData.title}</h2>
                <div className="flex items-center justify-center gap-2">
                    <EditCoursDialog
                        open={openEditCoursDialog}
                        onOpenChange={setOpenEditCoursDialog}
                        cours={courseData}
                        onCoursUpdate={refreshCoursData}
                        isTablet={isTablet}
                    />
                    <DeleteCoursDialog
                        open={openDeleteCoursDialog}
                        onOpenChange={setOpenDeleteCoursDialog}
                        isTablet={isTablet}
                    />
                    {isTablet && <Button
                        variant="outline"
                        onClick={() => setOpenDetails(!openDetails)}
                    >
                        {!openDetails ? <ListCollapseIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                    </Button>}
                </div>
            </header>
            <div className="flex items-start justify-start w-full h-full">
                <CoursSubscriptions
                    isTablet={isTablet}
                    openDetails={openDetails}
                    refreshCoursData={refreshCoursData}
                    cours={courseData}
                />
                <AsideCoursDetails course={courseData} isTablet={isTablet} openDetails={openDetails} />
            </div>
        </div>
    );
}