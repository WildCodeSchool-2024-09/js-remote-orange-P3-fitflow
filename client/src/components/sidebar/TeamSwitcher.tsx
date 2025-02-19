"use client";

import { Building2, ChevronsUpDown, Plus, User } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Building2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    Fitflow
                                </span>
                                <span className="truncate text-xs">Entreprise</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Mes collaborateurs
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <User className="size-4 shrink-0" />
                            </div>
                            mihatchi@outlook.fr
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <User className="size-4 shrink-0" />
                            </div>
                            dev@hatchimike.com
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <User className="size-4 shrink-0" />
                            </div>
                            personal@hatchimike.com
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Ajouter un collaborateur</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
