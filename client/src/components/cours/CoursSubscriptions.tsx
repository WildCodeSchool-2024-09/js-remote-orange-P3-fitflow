import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Command, CommandInput, CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useClientsContext } from "@/context/ClientsContext";
import { Checkbox } from "@/components/ui/checkbox";

function CoursSubscriptions({ isTablet, openDetails }: { isTablet: boolean, openDetails: boolean }) {
    const [searchParticipants, setSearchParticipants] = useState<string>("");
    const [openCommand, setOpenCommand] = useState<boolean>(false);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const { clients } = useClientsContext();

    const filteredClients = clients.filter((client) => client.first_name.toLowerCase().includes(searchParticipants.toLowerCase()));

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
                <Button className="w-full lg:w-fit" onClick={() => setOpenCommand(true)}>
                    <PlusIcon className="w-4 h-4" />
                    Ajouter un participant
                </Button>
            </header>

            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <Command>
                    <CommandInput placeholder="Recherchez des clients" />
                    <CommandList>
                        <CommandEmpty>
                            Aucun clients trouvé
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredClients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                    onSelect={() => {
                                        const isSelected = selectedClients.includes(client.id.toString());
                                        if (isSelected) {
                                            setSelectedClients(prev => prev.filter(id => id !== client.id.toString()));
                                        } else {
                                            setSelectedClients(prev => [...prev, client.id.toString()]);
                                        }
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedClients.includes(client.id.toString())}
                                        className="mr-2"
                                    />
                                    {client.first_name} {client.last_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>

        </div>
    );
}

export default CoursSubscriptions;