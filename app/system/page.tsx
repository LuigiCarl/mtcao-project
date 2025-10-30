"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Info, 
  Code, 
  Database, 
  Layers, 
  Globe, 
  Mail,
  MessageCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react"

export default function SystemPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  System
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>System Information</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
          {/* System Information Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Application Version</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">v1.0.0</div>
                <p className="text-xs text-muted-foreground">Frontend Demo Build</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Framework</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Next.js 16</div>
                <p className="text-xs text-muted-foreground">React 19 with TypeScript</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Not Connected</div>
                <p className="text-xs text-muted-foreground">Frontend Only - Demo Data</p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Technology Stack
              </CardTitle>
              <CardDescription>
                Modern technologies used in this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Frontend</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Next.js 16.0.0 with App Router</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>React 19 with TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Tailwind CSS v4</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>shadcn/ui Components</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Recharts for Data Visualization</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Form Management</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>React Hook Form</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Zod Schema Validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Date Picker with react-day-picker</span>
                    </li>
                  </ul>
                  <h4 className="font-semibold text-sm pt-2">Theme</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Dark/Light Mode (next-themes)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Responsive Design</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action - Need Backend Development */}
          <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Globe className="h-5 w-5" />
                Need Backend Development?
              </CardTitle>
              <CardDescription className="text-base">
                Transform this frontend demo into a fully functional application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm dark:prose-invert">
                <p className="text-muted-foreground">
                  This is currently a <strong>frontend-only demonstration</strong> showcasing the user interface and design capabilities. 
                  To make this a complete, production-ready tourism management system, it needs:
                </p>
              </div>
              
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 my-4">
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <Database className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <strong>Database Integration</strong>
                    <p className="text-muted-foreground">PostgreSQL, MySQL, or MongoDB setup with proper data persistence</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Code className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <strong>Backend API Development</strong>
                    <p className="text-muted-foreground">RESTful or GraphQL APIs with Node.js, Express, or Nest.js</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <strong>Authentication & Security</strong>
                    <p className="text-muted-foreground">User management, role-based access control, and data encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Layers className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <strong>Business Logic</strong>
                    <p className="text-muted-foreground">Report generation, data analytics, export functionality, and more</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  Ready to Build Your Complete Solution?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  I specialize in full-stack development and can transform this beautiful frontend into a 
                  robust, scalable application tailored to your specific needs. With expertise in modern 
                  web technologies, I ensure your project is built with best practices, security, and performance in mind.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span className="hidden xs:inline">Contact for Full Development</span>
                    <span className="xs:hidden">Contact</span>
                  </Button>
                  <Button variant="outline" className="gap-2 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden xs:inline">Discuss Your Requirements</span>
                    <span className="xs:hidden">Discuss</span>
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>
                  <strong>Why choose professional development?</strong> Get a secure, scalable solution with 
                  proper database design, API architecture, automated backups, deployment support, and ongoing 
                  maintenance. Transform your idea into reality with confidence.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Project Name:</dt>
                  <dd className="font-medium">MTCAO Tourism Management System</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Environment:</dt>
                  <dd className="font-medium">Development (Demo)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Build Date:</dt>
                  <dd className="font-medium">October 28, 2025</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">License:</dt>
                  <dd className="font-medium">Proprietary / Demo Only</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
