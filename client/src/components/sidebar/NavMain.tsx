import {
    Activity,
    Calendar,
    Dumbbell,
    House,
    Sparkles,
    User,
    Users
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain() {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Général</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/dashboard'}
                        onClick={() => navigate('/app/dashboard')}
                    >
                        <House />
                        <span>Dashboard</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/clients'}
                        onClick={() => navigate('/app/clients')}
                    >
                        <Users />
                        <span>Clients</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/cours'}
                        onClick={() => navigate('/app/cours')}
                    >
                        <Calendar />
                        <span>Cours</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/workouts'}
                        onClick={() => navigate('/app/workouts')}
                    >
                        <Dumbbell />
                        <span>Workouts</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/exercices'}
                        onClick={() => navigate('/app/exercices')}
                    >
                        <Activity />
                        <span>Exercices</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/plans'}
                        onClick={() => navigate('/app/plans')}
                    >
                        <Sparkles />
                        <span>Plans</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        isActive={pathname === '/app/profil'}
                        onClick={() => navigate('/app/profil')}
                    >
                        <User />
                        <span>Profil</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
