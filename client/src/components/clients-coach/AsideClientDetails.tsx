import { AtSignIcon, CalendarIcon, ContactIcon, NotebookIcon, PhoneIcon, RulerIcon, UsersIcon, WeightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

type Client = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    birth_date: string;
    weight_kg: number;
    height_cm: number;
    notes: string;
}

function AsideClientDetails({ client, openDetails, isTablet }: { client: Client, openDetails: boolean, isTablet: boolean }) {

    return (
        <aside className={`flex flex-col items-start justify-start w-full max-w-lg h-full border-l border-gray-200 ${isTablet && openDetails === false ? "hidden" : isTablet && openDetails === true ? "flex max-w-full border-l-0" : ""}`}>
            <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">
                <h2>Details</h2>
            </header>
            <div className="flex flex-col items-start justify-start w-full p-6 gap-6">
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <ContactIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Prénom</p>
                    </div>
                    <p className="text-sm">{client.first_name}</p>
                </div>
                <div className="flex items-start justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <ContactIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Nom</p>
                    </div>
                    <p className="text-sm">{client.last_name}</p>
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <UsersIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Genre</p>
                    </div>
                    {client.gender === 'male' ? <Badge>Homme</Badge> : <Badge variant="secondary">Femme</Badge>}
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <AtSignIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Email</p>
                    </div>
                    <p className="text-sm">{client.email}</p>
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Téléphone</p>
                    </div>
                    <p className="text-sm">+{client.phone}</p>
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Date de naissance</p>
                    </div>
                    <p className="text-sm">{new Date(client.birth_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <WeightIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Poids</p>
                    </div>
                    <p className="text-sm">{client.weight_kg} kg</p>
                </div>
                <div className="flex items-center justify-start w-full gap-3">
                    <div className="flex items-center justify-start w-1/2 gap-3">
                        <RulerIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 mr-10">Taille</p>
                    </div>
                    <p className="text-sm">{client.height_cm} cm</p>
                </div>
                <Separator />
                <div className="flex items-center justify-start w-full gap-3">
                    <NotebookIcon className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500 mr-10">Notes</p>
                </div>
                <p className="text-sm">{client.notes}</p>
            </div>
        </aside>
    );
}

export default AsideClientDetails;