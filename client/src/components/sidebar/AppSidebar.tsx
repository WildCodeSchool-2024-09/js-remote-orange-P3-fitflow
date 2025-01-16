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
// This is sample data.



function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                {state === "expanded" && (
                    <Card className="h-fit mb-4">
                        <CardHeader className="p-4">
                            <Badge className=" flex items-center gap-1 bg-green-100 text-green-500 text-xs font-normal w-fit border border-green-500 px-2 hover:bg-green-100">
                                <Sparkles className="w-3 h-3" />
                                Free
                            </Badge>
                            <CardTitle className="text-sm font-medium">Passez au Pro</CardTitle>
                            <CardDescription
                                className="text-xs text-gray-500">
                                Accédez aux fonctionnalités essentielles pour votre activité.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3 py-3">
                            <Button className="w-full text-sm font-medium">Passer au Pro</Button>
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