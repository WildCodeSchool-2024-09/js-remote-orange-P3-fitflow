import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddCoursDialog from "./AddCoursDialog";
import { useState } from "react";
import { Toaster } from "../ui/toaster";
import { useCoursContext } from "@/context/CoursContext";
import CoursItem from "./CoursItem";

function CoursWrapper() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isFree, setIsFree] = useState("tous");

    const { cours } = useCoursContext();

    const filteredCours = cours.filter((cours) => {
        const matchSearch = !search || cours.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "all" || !status || cours.current_status === status;
        const matchFree = isFree === "tous" ||
            (isFree === "yes" && Boolean(cours.is_free)) ||
            (isFree === "no" && !cours.is_free);

        return matchSearch && matchStatus && matchFree;
    });

    return (
        <div className="flex flex-col items-start justify-start w-full h-screen">
            <Toaster />
            <header className="flex flex-col md:flex-row items-center justify-between w-full p-4 gap-4 bg-white">
                <div className="flex flex-col md:flex-row items-center justify-start w-full h-fit gap-2">
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Recherchez par titre"
                            className="pl-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="min-w-[100px] w-full md:w-fit">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                className="cursor-pointer"
                                value="all">
                                Tous
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="draft">
                                Brouillon
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="published">
                                Publié
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="full">
                                Complet
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="finished">
                                Terminé
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="cancelled">
                                Annulé
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={isFree} onValueChange={(value) => setIsFree(value)}>
                        <SelectTrigger className="min-w-[100px] w-full md:w-fit">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tous" className="cursor-pointer">Tous</SelectItem>
                            <SelectItem value="yes" className="cursor-pointer">Gratuit</SelectItem>
                            <SelectItem value="no" className="cursor-pointer">Payant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AddCoursDialog
                    open={open}
                    onOpenChange={setOpen}
                />
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start justify-start w-full h-fit p-6 gap-4">
                {filteredCours.map((cours) => (
                    <CoursItem key={cours.id} cours={cours} />
                ))}
            </div>
        </div>
    );
}

export default CoursWrapper;