import { usePlanContext } from "@/context/PlanContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfilForm from "../forms/ProfilForm";
import { Toaster } from "@/components/ui/toaster";

function ProfileContent() {
    const { planSubscription, plans } = usePlanContext();
    return (
        <div className="flex flex-col items-center justify-center w-full h-fit">
            <Toaster />
            <div className="flex flex-col items-start justify-start w-full max-w-5xl py-12 px-6">
                <div className="flex flex-col items-start justify-start w-full h-full gap-2">
                    <h1 className="text-2xl font-medium">Profil</h1>
                    <p className="text-sm text-gray-500 font-light pb-4">Gérez vos informations personnelles et vos préférences</p>
                    <div className="flex flex-col items-start justify-start w-full h-fit gap-6 bg-[#FBFBFB] border border-[#EEEFF1] rounded-lg p-4">
                        <div className="flex flex-col items-start justify-start w-full h-full gap-6">
                            <div className="flex items-center justify-start gap-2">
                                <img
                                    src={
                                        `${plans?.find(plan => plan.id === planSubscription?.plan_id)?.id === 1 ? '/icon-plan-free.png'
                                            : plans?.find(plan => plan.id === planSubscription?.plan_id)?.id === 2 ? '/icon-plan-essential.png'
                                                : plans?.find(plan => plan.id === planSubscription?.plan_id)?.id === 3 ? '/icon-plan-premium.png'
                                                    : plans?.find(plan => plan.id === planSubscription?.plan_id)?.id === 4 ? '/icon-plan-custom.png'
                                                        : '/icon-plan-free.png'}`} alt={plans?.find(plan => plan.id === planSubscription?.plan_id)?.plan_name} className="w-12 h-12" />
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <p className="text-base font-medium">{plans?.find(plan => plan.id === planSubscription?.plan_id)?.plan_name}</p>
                                    <Badge className="h-5 px-1 text-xs font-medium bg-blue-100 text-blue-500 border rounded-full border-blue-400 hover:bg-blue-1000">
                                        {planSubscription?.type_of_subscription === "monthly" ? "Mensuellement" : "Annuellement"}
                                    </Badge>
                                </div>
                            </div>
                            {
                                planSubscription?.type_of_subscription === "monthly" ? (
                                    <p className="text-sm font-medium">{plans?.find(plan => plan.id === planSubscription?.plan_id)?.price_per_month}€<span className="text-sm font-medium text-[#9FA1A7]">/mois</span></p>
                                ) : (
                                    <p className="text-sm font-medium">{plans?.find(plan => plan.id === planSubscription?.plan_id)?.price_per_year}€<span className="text-sm font-medium text-[#9FA1A7]">/an</span></p>
                                )
                            }
                            <p className="text-sm font-medium">{planSubscription?.type_of_subscription === "monthly" ? "Mensuellement" : "Annuellement"}<span className="text-sm font-medium text-[#9FA1A7]"> - Commencé le {planSubscription?.subscription_start_date ? new Date(planSubscription?.subscription_start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ""}</span></p>
                            <Button
                                variant="outline"
                                className="w-fit">
                                Gérer mon abonnement
                            </Button>
                        </div>
                    </div>
                    <Separator className="w-full h-px bg-gray-200 my-12" />
                    <div className="flex flex-col items-start justify-start w-full h-full gap-6">
                        <ProfilForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileContent;