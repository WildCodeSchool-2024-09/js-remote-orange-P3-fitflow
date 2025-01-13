"use client"

import { useUser } from "@/context/UserContext";
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    //AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavUser() {

    const { isMobile } = useSidebar()
    const { coach, setUser } = useUser();

    const handleLogout = () => {
        fetch("http://localhost:3310/app/dashboard", {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                setUser(null);
            })
            .catch(error => {
                console.error("Erreur lors de la déconnexion:", error);
            })
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/*  <AvatarImage src={user?.avatar} alt={user?.name} /> */}
                                <AvatarFallback className="rounded-lg">
                                    {coach?.first_name && coach?.last_name ?
                                        `${coach.first_name.charAt(0)}${coach.last_name.charAt(0)}` :
                                        'CN'
                                    }
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{coach?.first_name}</span>
                                <span className="truncate text-xs">{coach?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
                                    <AvatarFallback className="rounded-lg">{coach?.first_name && coach?.last_name ?
                                        `${coach.first_name.charAt(0)}${coach.last_name.charAt(0)}` :
                                        'CN'
                                    }</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{coach?.first_name}</span>
                                    <span className="truncate text-xs">{coach?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <BadgeCheck />
                                Compte
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                            <LogOut />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}