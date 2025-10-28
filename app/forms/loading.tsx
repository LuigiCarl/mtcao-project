import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function FormsLoading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Forms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Page Header */}
          <div className="mb-4">
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-5 w-[350px]" />
          </div>

          {/* Tabs */}
          <Skeleton className="h-10 w-full mb-4" />

          {/* Form Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px] mb-2" />
              <Skeleton className="h-4 w-[280px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-4">
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[140px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
