"use client"
import { Home, Calendar, BookOpen, GraduationCap, Library, Users, Settings, Bell, FileText } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  { title: "ホーム", icon: Home, href: "/" },
  { title: "時間割", icon: Calendar, href: "/schedule" },
  { title: "履修管理", icon: BookOpen, href: "/courses" },
  { title: "成績", icon: GraduationCap, href: "/grades" },
]

const resourceItems = [
  { title: "図書館", icon: Library, href: "/library" },
  { title: "お知らせ", icon: Bell, href: "/announcements" },
  { title: "資料", icon: FileText, href: "/documents" },
  { title: "コミュニティ", icon: Users, href: "/community" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">学生ポータル</span>
            <span className="text-xs text-muted-foreground">2024年度</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メインメニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>学習リソース</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src="/diverse-students-studying.png" />
            <AvatarFallback>田中</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">田中 太郎</p>
            <p className="truncate text-xs text-muted-foreground">情報工学科 3年</p>
          </div>
          <SidebarMenuButton asChild>
            <a href="/settings">
              <Settings className="size-4" />
            </a>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
