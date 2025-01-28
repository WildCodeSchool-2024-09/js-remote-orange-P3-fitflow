import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePlanContext } from "@/context/PlanContext";
import { CircleCheck } from "lucide-react";

type Plan = {
    id: number;
    plan_name: string;
    plan_description: string;
    price_per_month: number;
    price_per_year: number;
}

type Feature = {
    id: number;
    plan_id: number;
    feature_name: string;
}

type Coach = {
    id?: number;
    user_id?: number;
    plan_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    speciality: string;
    bio: string;
}

type PlanSubscription = {
    id: number;
    coach_id: number;
    plan_id: number;
    subscription_start_date: Date;
    subscription_end_date: Date;
    subscription_status: string;
    type_of_subscription: string;
}

function PlanItem({ plan, features, selectedBilling, coach, planSubscription }: { plan: Plan, features: Feature[], selectedBilling: string, coach: Coach, planSubscription: PlanSubscription }) {
    const { setPlanSubscription, fetchPlans } = usePlanContext();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSubscribe = async () => {
        if (!coach) return;

        // Fonction pour formater la date en format MySQL
        const formatDateForMySQL = (date: Date) => {
            return date.toISOString().slice(0, 19).replace('T', ' ');
        };

        try {
            const startDate = new Date();
            const endDate = selectedBilling === "Mensuel" || selectedBilling === "Annuel" && plan.id === 1
                ? new Date(new Date().setDate(new Date().getDate() + 14))
                : selectedBilling === "Mensuel"
                    ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                    : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

            const response = await fetch("http://localhost:3310/app/plans", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: planSubscription.id,
                    plan_id: plan.id,
                    coach_id: planSubscription.coach_id,
                    subscription_start_date: formatDateForMySQL(startDate),
                    subscription_end_date: formatDateForMySQL(endDate),
                    subscription_status: "active",
                    type_of_subscription: selectedBilling === "Mensuel" ? "monthly" : "yearly",
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log("Réponse du serveur:", data);

            if (data.planSubscription) {
                setPlanSubscription(data.planSubscription);
                () => fetchPlans();

                setDialogOpen(false);
                toast({
                    description: (
                        <div className="flex items-start gap-1">
                            <CircleCheck fill="#019939" color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} className="w-5 h-5" />
                            <div className="flex flex-col items-start gap-1 pl-2">
                                <p className="text-[#016626] font-medium text-sm">Inscription au plan réussie</p>
                                <p className="text-[#016626] font-medium text-xs">Vous avez maintenant souscrit à votre plan avec succès.</p>
                            </div>
                        </div>
                    ),
                    className: "bg-[#EBFBF1] text-[#016626] font-light border border-[#C1F4D4]"
                });
            }
            return true;
        } catch (error) {
            console.error("Échec de la souscription au plan:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la souscription au plan",
                variant: "destructive",
            });
            return false;
        }
    }

    const isCurrentPlanMonthly = plan.id === planSubscription.plan_id && planSubscription.type_of_subscription === "monthly" && selectedBilling === "Mensuel";
    const isCurrentPlanYearly = plan.id === planSubscription.plan_id && planSubscription.type_of_subscription === "yearly" && selectedBilling === "Annuel";
    const isCurrentPlanFree = plan.id === planSubscription.plan_id && plan.id === 1;

    return (
        <Card className={`flex flex-col items-start justify-between w-full h-full p-6 bg-white rounded-xl shadow-md gap-4 ${isCurrentPlanMonthly || isCurrentPlanYearly || isCurrentPlanFree ? 'border-2 border-neutral-900' : ''}`}>
            <CardHeader className="flex flex-col items-start justify-center w-full pt-0 px-0 pb-0">
                <img
                    src={
                        `${plan.id === 1 ? '/icon-plan-free.png'
                            : plan.id === 2 ? '/icon-plan-essential.png'
                                : plan.id === 3 ? '/icon-plan-premium.png'
                                    : plan.id === 4 ? '/icon-plan-custom.png'
                                        : '/icon-plan-free.png'}`} alt={plan.plan_name} className="w-12 h-12" />
                <CardTitle
                    className="flex items-center justify-start gap-2 text-xl font-medium w-full text-left"
                >
                    {plan.plan_name}
                    {(isCurrentPlanMonthly || isCurrentPlanYearly || isCurrentPlanFree) &&
                        <Badge className="text-xs font-medium">
                            Votre plan
                        </Badge>
                    }
                </CardTitle>
                <CardDescription
                    className="text-sm text-gray-500 w-full pb-4"
                >
                    {plan.plan_description}
                </CardDescription>
                <div className="w-full h-px bg-gray-200"></div>
                <p
                    className="text-2xl font-medium pt-4"
                >
                    {Math.round(selectedBilling === "Mensuel" ? plan.price_per_month : plan.price_per_year)}€
                    <span
                        className="text-sm text-gray-400 font-light"
                    >
                        {selectedBilling === "Mensuel" ? "/mois" : "/an"}
                    </span>
                </p>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center w-full gap-4 px-0 ">
                {features
                    .filter((feature) => feature.plan_id === plan.id)
                    .map((feature) => (
                        <p className="text-sm text-gray-500 font-light" key={feature.id}>{feature.feature_name}</p>
                    ))}
            </CardContent>
            {isCurrentPlanMonthly || isCurrentPlanYearly || isCurrentPlanFree ? (<Button
                disabled={true}
                className="w-full"
            >
                Votre plan actuel
            </Button>) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full"
                            onClick={() => setDialogOpen(true)}
                        >
                            Choisir ce plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="border-b border-gray-200 pb-4">
                            <DialogTitle>Confirmer votre choix</DialogTitle>
                            <DialogDescription>Vous êtes sur le point de choisir le plan {plan.plan_name}.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-start justify-center w-full h-full gap-1">
                            <img
                                src={
                                    `${plan.id === 1 ? '/icon-plan-free.png'
                                        : plan.id === 2 ? '/icon-plan-essential.png'
                                            : plan.id === 3 ? '/icon-plan-premium.png'
                                                : plan.id === 4 ? '/icon-plan-custom.png'
                                                    : '/icon-plan-free.png'}`} alt={plan.plan_name} className="w-12 h-12" />
                            <p className="flex items-center justify-start gap-2 text-xl font-medium w-full text-left">{plan.plan_name}
                                <Badge className="h-6 ml-2 px-1 text-[10px] font-medium bg-blue-200 text-blue-500 border rounded-full hover:bg-blue-200">
                                    {selectedBilling}
                                </Badge>
                            </p>
                            <p className="text-sm text-gray-500 font-light">{plan.plan_description}</p>
                            <p
                                className="text-2xl font-medium pt-4"
                            >
                                {Math.round(selectedBilling === "Mensuel" ? plan.price_per_month : plan.price_per_year)}€
                                <span
                                    className="text-sm text-gray-400 font-light"
                                >
                                    {selectedBilling === "Mensuel" ? "/mois" : "/an"}
                                </span>
                            </p>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => {
                                handleSubscribe();
                                setDialogOpen(false);
                            }}>
                                Confirmer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Card>

    );
}

export default PlanItem;