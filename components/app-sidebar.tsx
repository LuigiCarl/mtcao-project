"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Database,
  FileText,
  Settings,
  Info,
  BarChart3,
  Users,
  Ship,
  Activity,
} from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Data Entry",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Database,
        },
        {
          title: "Forms",
          url: "/forms",
          icon: FileText,
        },
      ],
    },
    {
      title: "Real-Time Monitoring",
      url: "#",
      items: [
        {
          title: "Monitoring Dashboard",
          url: "/monitoring",
          icon: Activity,
        },
      ],
    },
    {
      title: "Reports and Analytics",
      url: "#",
      items: [
        {
          title: "Monthly Reports",
          url: "/reports",
          icon: FileText,
        },
      ],
    },
    {
      title: "System",
      url: "#",
      items: [
        {
          title: "System Information",
          url: "/system",
          icon: Info,
        },
        {
          title: "Settings",
          url: "/system/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  const isActive = pathname === subItem.url || 
                    (subItem.url === '/dashboard' && pathname === '/')
                  
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={subItem.url} className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-2">
                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                            <span>{subItem.title}</span>
                          </span>
                          {'badge' in subItem && subItem.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground"></span>
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
