import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
function CoursSubscriptions({ isTablet, openDetails }: { isTablet: boolean, openDetails: boolean }) {
    const [searchParticipants, setSearchParticipants] = useState<string>("");
    return (
        <div className={cn("flex flex-col items-start justify-start w-full h-full p-4 bg-white", isTablet && openDetails === false ? "block" : isTablet && openDetails === true ? "hidden" : "")}>
            <header className="flex flex-wrap flex-col items-start justify-start w-full gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        value={searchParticipants}
                        onChange={(e) => setSearchParticipants(e.target.value)}
                        type="text"
                        placeholder="Recherchez des participants"
                        className="pl-10 w-full"
                    />
                </div>
                <Button className="w-full lg:w-fit">
                    <PlusIcon className="w-4 h-4" />
                    Ajouter un participant
                </Button>
            </header>

        </div>
    );
}

export default CoursSubscriptions;