import { usePlanContext } from "@/context/PlanContext";
import PlanItem from "./PlanItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

type Plan = {
    id: number;
    plan_name: string;
    plan_description: string;
    price_per_month: number;
    price_per_year: number;
}

function PlanContainer() {
    const { plans, coach, features, planSubscription } = usePlanContext();
    const [selectedBilling, setSelectedBilling] = useState<string>("Mensuel");

    // Trier les plans pour mettre l'id 1 en dernier
    const sortedPlans = plans?.sort((a, b) => {
        if (a.id === 1) return 1;
        if (b.id === 1) return -1;
        return 0;
    });

    return (
        <div className="flex flex-col items-center justify-center h-fit w-full p-6 gap-6">
            <Toaster />
            <div className="flex flex-col items-start justify-center w-full max-w-5xl h-full gap-3">
                <h1 className="text-2xl font-medium">Plans</h1>
                <p className="text-sm text-gray-500 font-light">Choisissez le plan qui vous convient le mieux</p>
                <Tabs defaultValue={selectedBilling} className="w-96">
                    <TabsList>
                        <TabsTrigger
                            value="Mensuel"
                            onClick={() => setSelectedBilling("Mensuel")}
                        >
                            Mensuel
                        </TabsTrigger>
                        <TabsTrigger
                            value="Annuel"
                            onClick={() => setSelectedBilling("Annuel")}
                        >
                            Annuel
                            <Badge className="h-4 ml-2 px-1 text-[10px] font-medium bg-blue-100 text-blue-500 border rounded-full py-[0px] border-blue-400 hover:bg-blue-1000">
                                -15%
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-center justify-center w-full h-full max-w-5xl gap-6">
                {sortedPlans?.map((plan: Plan, index: number) => {
                    return (
                        <div key={plan.id} className={`h-full ${index === sortedPlans.length - 1 && sortedPlans.length % 3 === 1 ? 'md:col-span-3' :
                            index === sortedPlans.length - 1 && sortedPlans.length % 3 === 2 ? 'md:col-span-2' : ''}`}>
                            <PlanItem
                                plan={plan}
                                coach={coach || {
                                    id: 0,
                                    user_id: 0,
                                    plan_id: 0,
                                    first_name: '',
                                    last_name: '',
                                    email: '',
                                    phone_number: '',
                                    speciality: '',
                                    bio: ''
                                }}
                                features={features}
                                selectedBilling={selectedBilling}
                                planSubscription={planSubscription || { id: 0, coach_id: 0, plan_id: 0, subscription_start_date: new Date(), subscription_end_date: new Date(), subscription_status: "", type_of_subscription: "" }}

                            />
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default PlanContainer;