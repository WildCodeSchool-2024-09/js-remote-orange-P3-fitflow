
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddWorkoutDialog from "@/components/workouts/AddWorkoutDialog";
import { Toaster } from "@/components/ui/toaster";
import WorkoutsItem from "@/components/workouts/WorkoutsItem";
import { useWorkoutsContext } from "@/context/WorkoutsContext";

function WorkoutsWrapper() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [level, setLevel] = useState("all");
    const { workouts, fetchWorkouts } = useWorkoutsContext();

    return (
        <div className="flex flex-col items-start justify-start w-full h-screen bg-white">
            <Toaster />
            <header className="flex flex-col md:flex-row items-center justify-start w-full h-fit gap-4 bg-white py-6 px-4">
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
                    <Select
                        value={level}
                        onValueChange={(value) => setLevel(value)}
                    >
                        <SelectTrigger className="min-w-[150px] w-full md:w-fit">
                            <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AddWorkoutDialog
                    open={open}
                    onOpenChange={setOpen}
                    onWorkoutUpdate={fetchWorkouts}
                />
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start justify-start w-full h-fit bg-white p-6">
                {workouts.filter((workout) => workout.title.toLowerCase().includes(search.toLowerCase()) && (level === "all" || workout.level_of_difficulty === level)).map((workout) => (
                    <WorkoutsItem key={workout.id} workout={workout} />
                ))}
            </main>
        </div>
    )
}

export default WorkoutsWrapper;