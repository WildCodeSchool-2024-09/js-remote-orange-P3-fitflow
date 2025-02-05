"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/NavMain"
import { NavUser } from "@/components/sidebar/NavUser"
import { TeamSwitcher } from "@/components/sidebar/TeamSwitcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import { Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { usePlanContext } from "@/context/PlanContext"
import { useNavigate } from "react-router-dom"
// This is sample data.



function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();
    const { planSubscription } = usePlanContext();
    const navigate = useNavigate();

    const daysRemaining = planSubscription?.subscription_end_date
        ? Math.ceil((new Date(planSubscription.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                {state === "expanded" && planSubscription && planSubscription?.plan_id === 1 && (
                    <Card className="h-fit mb-4">
                        <CardHeader className="p-4">
                            <Badge className="h-4 flex items-center gap-1 bg-green-100 text-green-500 text-xs font-normal w-fit border border-green-400 px-2 py-[9px] rounded-full hover:bg-green-100">
                                <Sparkles className="w-3 h-3" />
                                {daysRemaining} jours restants
                            </Badge>
                            <CardTitle className="text-sm font-medium">Passer au plan Essentiel</CardTitle>
                            <CardDescription
                                className="text-xs text-gray-500">
                                Accédez aux fonctionnalités essentielles pour votre activité.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 py-3">
                            <Button
                                onClick={() => navigate('/app/plans')}
                                className="w-full text-sm font-medium">Changer de plan</Button>
                        </CardContent>
                    </Card>
                )}
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar;