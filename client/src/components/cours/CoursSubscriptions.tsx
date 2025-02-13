import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Toaster } from "../ui/toaster";

function CoursSubscriptions({ isTablet, openDetails, refreshCoursData, cours }: {
    isTablet: boolean,
    openDetails: boolean,
    refreshCoursData: () => Promise<void>,
    cours: any
}) {
    const [coursData, setCoursData] = useState<any>(cours);

    useEffect(() => {
        setCoursData(cours);
    }, [cours]);

    return (
        <div className={cn("flex flex-col items-start justify-start w-full h-full p-4 bg-white", isTablet && openDetails === false ? "block" : isTablet && openDetails === true ? "hidden" : "")}>
            <Toaster />
            <div className="w-full mt-4">
                <DataTable
                    columns={columns}
                    data={coursData?.participants || []}
                    onDataChange={async () => {
                        await refreshCoursData();
                    }}
                    maxParticipants={coursData?.max_participants || 0}
                    cours={coursData}
                    refreshCoursData={refreshCoursData}
                />
            </div>
        </div>
    );
}

export default CoursSubscriptions;