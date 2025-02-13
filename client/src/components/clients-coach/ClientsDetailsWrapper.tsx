import { ListCollapseIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import AsideClientDetails from "./AsideClientDetails";
import ClientCourseSubscription from "./ClientCourseSubscription";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import ClientsWorkouts from "./ClientsWorkouts";
import DeleteClientDialog from "./DeleteClientDialog";
import { useParams } from "react-router-dom";
import { EditClientDialog } from "./EditClientDialog";
import { Toaster } from "../ui/toaster";

type Client = {
    id: number;
    coach_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
    cours: any;
    coursParticipants: any;
}

function ClientsDetailsWrapper({ client, }: { client: Client }) {
    const [tab, setTab] = useState<string>("course");
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 992);
    const [openDeleteClientDialog, setOpenDeleteClientDialog] = useState<boolean>(false);
    const [openEditClientDialog, setOpenEditClientDialog] = useState<boolean>(false);
    const [clientData, setClientData] = useState<Client>(client);
    const { id } = useParams();

    const refreshClientData = async () => {
        try {
            const response = await fetch(`http://localhost:3310/app/clients/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            setClientData(data);
        } catch (error) {
            console.error("Erreur lors du rafraîchissement des données:", error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsTablet(window.innerWidth < 992);
            if (isTablet) {
                setOpenDetails(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Nettoyage de l'event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col items-start justify-start w-full h-screen">
            <Toaster />
            <header className={`flex items-center justify-between w-full ${isTablet ? "px-4 py-2" : "px-6 py-4"} border-b border-gray-200`}>
                <h2 className="text-sm font-medium">
                    {clientData ?
                        `${clientData.first_name} ${clientData.last_name}` :
                        "Aucun client sélectionné"}
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <EditClientDialog
                        open={openEditClientDialog}
                        onOpenChange={setOpenEditClientDialog}
                        client={clientData}
                        onClientUpdate={refreshClientData}
                        isTablet={isTablet}
                    />
                    <DeleteClientDialog
                        open={openDeleteClientDialog}
                        onOpenChange={setOpenDeleteClientDialog}
                        numberOfClients={1}
                        selectedClientIds={id ? [Number(id)] : []}
                        table={null}
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
                <div className={`flex flex-col items-start justify-start w-full h-full ${isTablet && openDetails === false ? "block" : isTablet && openDetails === true ? "hidden" : ""}`}>
                    <header className={`flex items-center justify-between w-full py-3 ${isTablet ? "px-4" : "px-6"} border-b border-gray-200`}>
                        <Tabs defaultValue="course">
                            <TabsList className="h-fit">
                                <TabsTrigger
                                    className="h-6"
                                    value="course"
                                    onClick={() => setTab("course")}
                                >Cours</TabsTrigger>
                                <TabsTrigger
                                    className="h-6"
                                    value="workouts"
                                    onClick={() => setTab("workouts")}
                                >Workouts</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </header>
                    {tab === "course" && <ClientCourseSubscription client={clientData} participants={clientData.coursParticipants} />}
                    {tab === "workouts" && <ClientsWorkouts client={clientData} />}
                </div>
                <AsideClientDetails client={clientData} openDetails={openDetails} isTablet={isTablet} />
            </div>
        </div>
    );
}

export default ClientsDetailsWrapper;