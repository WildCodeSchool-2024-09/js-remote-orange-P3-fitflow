import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Toaster } from "../ui/toaster";

function CoursSubscriptions({ isTablet, openDetails }: { isTablet: boolean, openDetails: boolean }) {
    const { id } = useParams();
    const [coursData, setCoursData] = useState<any>(null);

    const fetchCours = async () => {
        const response = await fetch(`http://localhost:3310/app/cours/${id}`, {
            credentials: "include",
        });
        const data = await response.json();
        setCoursData(data);
    };

    useEffect(() => {
        fetchCours();
    }, [id]);

    return (
        <div className={cn("flex flex-col items-start justify-start w-full h-full p-4 bg-white", isTablet && openDetails === false ? "block" : isTablet && openDetails === true ? "hidden" : "")}>
            <Toaster />
            <div className="w-full mt-4">
                <DataTable
                    columns={columns}
                    data={coursData?.participants || []}
                    onDataChange={fetchCours}
                />
            </div>
        </div>
    );
}

export default CoursSubscriptions;