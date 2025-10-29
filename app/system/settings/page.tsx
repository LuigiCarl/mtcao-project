"use client"

import * as React from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  Database, 
  Bell, 
  Eye, 
  Shield, 
  FileText, 
  Download,
  Upload,
  Save,
  Mail,
  Clock,
  DollarSign,
  Calendar,
  Globe,
  Lock,
  Key,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">System</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your system configuration and preferences
              </p>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Office Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your tourism office
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="office-name">Office Name</Label>
                      <Input id="office-name" defaultValue="Municipal Tourism Culture and Arts Office" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipality">Municipality</Label>
                      <Input id="municipality" defaultValue="Your Municipality" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" defaultValue="tourism@municipality.gov.ph" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" defaultValue="+63 XXX XXX XXXX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Office Address</Label>
                    <Textarea id="address" defaultValue="Municipal Hall, Main Street" rows={2} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Regional Settings
                  </CardTitle>
                  <CardDescription>
                    Configure timezone, currency, and language preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="asia-manila">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-manila">Asia/Manila (UTC+8)</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                          <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="php">
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="php">PHP (₱)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fil">Filipino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                  <CardDescription>
                    Set your office operating hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="opening-time">Opening Time</Label>
                      <Input id="opening-time" type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-time">Closing Time</Label>
                      <Input id="closing-time" type="time" defaultValue="17:00" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="weekends" />
                    <Label htmlFor="weekends">Open on weekends</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup & Export
                  </CardTitle>
                  <CardDescription>
                    Manage your data backups and exports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Export All Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download a complete backup of all tourists, trips, and boats data
                      </p>
                    </div>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Database Backup</p>
                      <p className="text-sm text-muted-foreground">
                        Create a full database backup (SQL format)
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Backup DB
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Import Data</p>
                      <p className="text-sm text-muted-foreground">
                        Import historical data from CSV files
                      </p>
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Data Retention
                  </CardTitle>
                  <CardDescription>
                    Configure how long data is kept in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Auto-archive records older than</Label>
                    <Select defaultValue="never">
                      <SelectTrigger id="retention-period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-backup" defaultChecked />
                    <Label htmlFor="auto-backup">Enable automatic weekly backups</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure when you want to receive email notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Tourist Registration</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a new tourist registers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Summary Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive daily statistics summary at 6:00 PM
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Analytics Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Get weekly analytics every Monday
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Boat Capacity Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Alert when a boat is near maximum capacity
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Maintenance</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about system updates and maintenance
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Notification Recipients
                  </CardTitle>
                  <CardDescription>
                    Add email addresses to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-email">Primary Email</Label>
                    <Input id="primary-email" type="email" defaultValue="admin@municipality.gov.ph" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-emails">Additional Recipients (comma-separated)</Label>
                    <Textarea 
                      id="secondary-emails" 
                      placeholder="email1@example.com, email2@example.com"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Preferences */}
            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize how data is displayed throughout the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger id="date-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY (10/29/2025)</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY (29/10/2025)</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD (2025-10-29)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number-format">Number Format</Label>
                      <Select defaultValue="comma">
                        <SelectTrigger id="number-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comma">1,000 (Comma)</SelectItem>
                          <SelectItem value="period">1.000 (Period)</SelectItem>
                          <SelectItem value="space">1 000 (Space)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="items-per-page">Items per Page</Label>
                      <Select defaultValue="10">
                        <SelectTrigger id="items-per-page">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-view">Default Dashboard View</Label>
                      <Select defaultValue="overview">
                        <SelectTrigger id="default-view">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="current-month">Current Month</SelectItem>
                          <SelectItem value="current-year">Current Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="show-charts" defaultChecked />
                      <Label htmlFor="show-charts">Show charts on dashboard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="compact-mode" />
                      <Label htmlFor="compact-mode">Compact mode (reduced spacing)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="animations" defaultChecked />
                      <Label htmlFor="animations">Enable animations</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Password & Authentication
                  </CardTitle>
                  <CardDescription>
                    Manage your password and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Change Password</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Session & Access
                  </CardTitle>
                  <CardDescription>
                    Configure session and access control settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="session-timeout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-logout" defaultChecked />
                    <Label htmlFor="auto-logout">Auto logout on browser close</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for external integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">API Key</p>
                      <code className="text-sm text-muted-foreground">••••••••••••••••••••••••••••</code>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Show</Button>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports */}
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Report Settings
                  </CardTitle>
                  <CardDescription>
                    Configure default settings for generated reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="report-format">Default Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="report-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-orientation">Page Orientation</Label>
                      <Select defaultValue="portrait">
                        <SelectTrigger id="report-orientation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="include-logo" defaultChecked />
                    <Label htmlFor="include-logo">Include office logo in reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="include-charts" defaultChecked />
                    <Label htmlFor="include-charts">Include charts and graphs</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Automated Reports
                  </CardTitle>
                  <CardDescription>
                    Schedule automatic report generation and delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated daily at 6:00 PM
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated every Monday at 8:00 AM
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monthly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated on the 1st of each month
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Annual Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated on January 1st
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
