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
import { useSettings } from "@/hooks/use-api"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)
  const [importType, setImportType] = React.useState<'tourists' | 'boats' | 'trips' | 'database' | null>(null)
  const [showClearDialog, setShowClearDialog] = React.useState(false)
  const [clearConfirmText, setClearConfirmText] = React.useState('')
  const [isClearing, setIsClearing] = React.useState(false)
  const { settings, loading, error, updateSettings, resetSettings } = useSettings()

  // Local state for form values
  const [formData, setFormData] = React.useState<any>({})

  // Update form data when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        // General
        office_name: settings.general?.office_name || '',
        municipality: settings.general?.municipality || '',
        contact_email: settings.general?.contact_email || '',
        contact_phone: settings.general?.contact_phone || '',
        office_address: settings.general?.office_address || '',
        timezone: settings.general?.timezone || 'asia-manila',
        currency: settings.general?.currency || 'php',
        language: settings.general?.language || 'en',
        opening_time: settings.general?.opening_time || '08:00',
        closing_time: settings.general?.closing_time || '17:00',
        open_weekends: settings.general?.open_weekends || false,
        // Data
        retention_period: settings.data?.retention_period || 'never',
        auto_backup: settings.data?.auto_backup || true,
        // Notifications
        notify_new_tourist: settings.notifications?.notify_new_tourist !== false,
        notify_daily_summary: settings.notifications?.notify_daily_summary !== false,
        notify_weekly_analytics: settings.notifications?.notify_weekly_analytics || false,
        notify_boat_capacity: settings.notifications?.notify_boat_capacity !== false,
        notify_system_maintenance: settings.notifications?.notify_system_maintenance !== false,
        notification_emails: settings.notifications?.notification_emails || '',
        // Display
        date_format: settings.display?.date_format || 'mdy',
        number_format: settings.display?.number_format || 'comma',
        items_per_page: settings.display?.items_per_page || 10,
        default_view: settings.display?.default_view || 'overview',
        show_charts: settings.display?.show_charts !== false,
        compact_mode: settings.display?.compact_mode || false,
        enable_animations: settings.display?.enable_animations !== false,
        // Security
        session_timeout: settings.security?.session_timeout || 30,
        auto_logout: settings.security?.auto_logout !== false,
        // Reports
        report_format: settings.reports?.report_format || 'pdf',
        report_orientation: settings.reports?.report_orientation || 'portrait',
        report_include_logo: settings.reports?.report_include_logo !== false,
        report_include_charts: settings.reports?.report_include_charts !== false,
        auto_report_daily: settings.reports?.auto_report_daily !== false,
        auto_report_weekly: settings.reports?.auto_report_weekly !== false,
        auto_report_monthly: settings.reports?.auto_report_monthly !== false,
        auto_report_annual: settings.reports?.auto_report_annual || false,
      })
    }
  }, [settings])

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const settingsArray = [
        // General
        { key: 'office_name', value: formData.office_name, type: 'string', group: 'general' },
        { key: 'municipality', value: formData.municipality, type: 'string', group: 'general' },
        { key: 'contact_email', value: formData.contact_email, type: 'string', group: 'general' },
        { key: 'contact_phone', value: formData.contact_phone, type: 'string', group: 'general' },
        { key: 'office_address', value: formData.office_address, type: 'string', group: 'general' },
        { key: 'timezone', value: formData.timezone, type: 'string', group: 'general' },
        { key: 'currency', value: formData.currency, type: 'string', group: 'general' },
        { key: 'language', value: formData.language, type: 'string', group: 'general' },
        { key: 'opening_time', value: formData.opening_time, type: 'string', group: 'general' },
        { key: 'closing_time', value: formData.closing_time, type: 'string', group: 'general' },
        { key: 'open_weekends', value: formData.open_weekends, type: 'boolean', group: 'general' },
        // Data
        { key: 'retention_period', value: formData.retention_period, type: 'string', group: 'data' },
        { key: 'auto_backup', value: formData.auto_backup, type: 'boolean', group: 'data' },
        // Notifications
        { key: 'notify_new_tourist', value: formData.notify_new_tourist, type: 'boolean', group: 'notifications' },
        { key: 'notify_daily_summary', value: formData.notify_daily_summary, type: 'boolean', group: 'notifications' },
        { key: 'notify_weekly_analytics', value: formData.notify_weekly_analytics, type: 'boolean', group: 'notifications' },
        { key: 'notify_boat_capacity', value: formData.notify_boat_capacity, type: 'boolean', group: 'notifications' },
        { key: 'notify_system_maintenance', value: formData.notify_system_maintenance, type: 'boolean', group: 'notifications' },
        { key: 'notification_emails', value: formData.notification_emails, type: 'string', group: 'notifications' },
        // Display
        { key: 'date_format', value: formData.date_format, type: 'string', group: 'display' },
        { key: 'number_format', value: formData.number_format, type: 'string', group: 'display' },
        { key: 'items_per_page', value: formData.items_per_page, type: 'integer', group: 'display' },
        { key: 'default_view', value: formData.default_view, type: 'string', group: 'display' },
        { key: 'show_charts', value: formData.show_charts, type: 'boolean', group: 'display' },
        { key: 'compact_mode', value: formData.compact_mode, type: 'boolean', group: 'display' },
        { key: 'enable_animations', value: formData.enable_animations, type: 'boolean', group: 'display' },
        // Security
        { key: 'session_timeout', value: formData.session_timeout, type: 'integer', group: 'security' },
        { key: 'auto_logout', value: formData.auto_logout, type: 'boolean', group: 'security' },
        // Reports
        { key: 'report_format', value: formData.report_format, type: 'string', group: 'reports' },
        { key: 'report_orientation', value: formData.report_orientation, type: 'string', group: 'reports' },
        { key: 'report_include_logo', value: formData.report_include_logo, type: 'boolean', group: 'reports' },
        { key: 'report_include_charts', value: formData.report_include_charts, type: 'boolean', group: 'reports' },
        { key: 'auto_report_daily', value: formData.auto_report_daily, type: 'boolean', group: 'reports' },
        { key: 'auto_report_weekly', value: formData.auto_report_weekly, type: 'boolean', group: 'reports' },
        { key: 'auto_report_monthly', value: formData.auto_report_monthly, type: 'boolean', group: 'reports' },
        { key: 'auto_report_annual', value: formData.auto_report_annual, type: 'boolean', group: 'reports' },
      ]

      await updateSettings(settingsArray)
      toast.success("Settings saved", {
        description: "Your settings have been saved successfully.",
      })
    } catch (err) {
      toast.error("Error", {
        description: "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default values?')) return
    
    setIsSaving(true)
    try {
      await resetSettings()
      toast.success("Settings reset", {
        description: "All settings have been reset to default values.",
      })
    } catch (err) {
      toast.error("Error", {
        description: "Failed to reset settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportAll = () => {
    toast.success("Export started", {
      description: "Downloading complete data export...",
    })
    window.open('http://127.0.0.1:8000/api/export/all', '_blank')
  }

  const handleExportTourists = () => {
    toast.success("Export started", {
      description: "Downloading tourists data...",
    })
    window.open('http://127.0.0.1:8000/api/export/tourists', '_blank')
  }

  const handleExportBoats = () => {
    toast.success("Export started", {
      description: "Downloading boats data...",
    })
    window.open('http://127.0.0.1:8000/api/export/boats', '_blank')
  }

  const handleExportTrips = () => {
    toast.success("Export started", {
      description: "Downloading trips data...",
    })
    window.open('http://127.0.0.1:8000/api/export/trips', '_blank')
  }

  const handleBackupDatabase = () => {
    toast.success("Backup started", {
      description: "Generating database backup...",
    })
    window.open('http://127.0.0.1:8000/api/export/database/backup', '_blank')
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, type: 'tourists' | 'boats' | 'trips') => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error("Invalid file", {
        description: "Please select a CSV file.",
      })
      return
    }

    setIsImporting(true)
    setImportType(type)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/import/${type}`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Import completed", {
          description: `Imported ${result.imported} records. ${result.skipped > 0 ? `Skipped ${result.skipped} records.` : ''}`,
        })
        
        if (result.errors && result.errors.length > 0) {
          console.error('Import errors:', result.errors)
        }
      } else {
        toast.error("Import failed", {
          description: result.message || "An error occurred during import.",
        })
      }
    } catch (err: any) {
      toast.error("Import failed", {
        description: err.message || "Failed to upload file.",
      })
    } finally {
      setIsImporting(false)
      setImportType(null)
      // Reset the input
      event.target.value = ''
    }
  }

  const handleDatabaseRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.sql')) {
      toast.error("Invalid file", {
        description: "Please select an SQL file.",
      })
      return
    }

    // Show confirmation dialog
    const confirmed = confirm(
      '⚠️ WARNING: This will REPLACE ALL DATA in your database!\n\n' +
      'Are you absolutely sure you want to restore from this backup?\n\n' +
      'This action cannot be undone!'
    )

    if (!confirmed) {
      event.target.value = ''
      return
    }

    setIsImporting(true)
    setImportType('database')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('confirm', 'true')

    try {
      const response = await fetch('http://127.0.0.1:8000/api/import/database', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Database restored", {
          description: `Executed ${result.executed} statements. ${result.errors?.length > 0 ? `${result.errors.length} errors occurred.` : 'All statements executed successfully.'}`,
        })
        
        if (result.errors && result.errors.length > 0) {
          console.error('Restore errors:', result.errors)
        }

        // Reload page after successful restore
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error("Database restore failed", {
          description: result.error || "An error occurred during restore.",
        })
        if (result.errors) {
          console.error('Restore errors:', result.errors)
        }
      }
    } catch (err: any) {
      toast.error("Database restore failed", {
        description: err.message || "Failed to restore database.",
      })
    } finally {
      setIsImporting(false)
      setImportType(null)
      event.target.value = ''
    }
  }

  const handleClearAllRecords = async () => {
    if (clearConfirmText !== 'DELETE ALL DATA') {
      toast.error("Confirmation failed", {
        description: 'You must type "DELETE ALL DATA" exactly to proceed.',
      })
      return
    }

    setIsClearing(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/data/clear-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirm: true,
          confirmation_text: clearConfirmText,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("All data cleared", {
          description: `Deleted ${result.total} records. Backup: ${result.backup_created}`,
        })
        
        setShowClearDialog(false)
        setClearConfirmText('')
        
        // Reload page after clearing
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error("Clear failed", {
          description: result.error || result.message,
        })
      }
    } catch (err: any) {
      toast.error("Clear failed", {
        description: err.message || "Failed to clear data.",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleClearTable = async (table: 'tourists' | 'boats' | 'trips') => {
    const confirmed = confirm(
      `⚠️ WARNING: This will DELETE ALL ${table.toUpperCase()} records!\n\n` +
      `Are you sure you want to continue?`
    )

    if (!confirmed) return

    setIsClearing(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/data/clear-table', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table,
          confirm: true,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`${table} cleared`, {
          description: `Deleted ${result.deleted} records.`,
        })
        
        // Reload page after clearing
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error("Clear failed", {
          description: result.error || result.message,
        })
      }
    } catch (err: any) {
      toast.error("Clear failed", {
        description: err.message || "Failed to clear table.",
      })
    } finally {
      setIsClearing(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-1 sm:gap-2 border-b px-2 sm:px-4 overflow-x-hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
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
                      <Input 
                        id="office-name" 
                        value={formData.office_name || ''} 
                        onChange={(e) => handleChange('office_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipality">Municipality</Label>
                      <Input 
                        id="municipality" 
                        value={formData.municipality || ''} 
                        onChange={(e) => handleChange('municipality', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email" 
                        value={formData.contact_email || ''} 
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input 
                        id="contact-phone" 
                        value={formData.contact_phone || ''} 
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Office Address</Label>
                    <Textarea 
                      id="address" 
                      value={formData.office_address || ''} 
                      onChange={(e) => handleChange('office_address', e.target.value)}
                      rows={2} 
                    />
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
                      <Select 
                        value={formData.timezone || 'asia-manila'} 
                        onValueChange={(value) => handleChange('timezone', value)}
                      >
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
                      <Select 
                        value={formData.currency || 'php'} 
                        onValueChange={(value) => handleChange('currency', value)}
                      >
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
                      <Select 
                        value={formData.language || 'en'} 
                        onValueChange={(value) => handleChange('language', value)}
                      >
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
                      <Input 
                        id="opening-time" 
                        type="time" 
                        value={formData.opening_time || '08:00'}
                        onChange={(e) => handleChange('opening_time', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-time">Closing Time</Label>
                      <Input 
                        id="closing-time" 
                        type="time" 
                        value={formData.closing_time || '17:00'}
                        onChange={(e) => handleChange('closing_time', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="weekends" 
                      checked={formData.open_weekends || false}
                      onCheckedChange={(checked) => handleChange('open_weekends', checked)}
                    />
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
                    <Button onClick={handleExportAll}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <p className="font-medium text-sm">Tourists Only</p>
                      <Button variant="outline" size="sm" onClick={handleExportTourists}>
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <p className="font-medium text-sm">Boats Only</p>
                      <Button variant="outline" size="sm" onClick={handleExportBoats}>
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <p className="font-medium text-sm">Trips Only</p>
                      <Button variant="outline" size="sm" onClick={handleExportTrips}>
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Database Backup</p>
                      <p className="text-sm text-muted-foreground">
                        Create a full database backup (SQL format)
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleBackupDatabase}>
                      <Download className="mr-2 h-4 w-4" />
                      Backup DB
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 dark:bg-amber-950">
                    <div className="space-y-1">
                      <p className="font-medium text-amber-900 dark:text-amber-100">Restore Database</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        ⚠️ WARNING: This will replace ALL data with the backup file
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".sql"
                        onChange={handleDatabaseRestore}
                        style={{ display: 'none' }}
                        id="restore-database"
                      />
                      <Button 
                        variant="outline" 
                        className="border-amber-600 text-amber-900 hover:bg-amber-100 dark:text-amber-100"
                        onClick={() => document.getElementById('restore-database')?.click()}
                        disabled={isImporting && importType === 'database'}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isImporting && importType === 'database' ? 'Restoring...' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="font-medium">Import Data from CSV</p>
                      <p className="text-sm text-muted-foreground">
                        Import historical data from CSV files. Select the type of data to import.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col gap-2 p-4 border rounded-lg">
                        <p className="font-medium text-sm">Import Tourists</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleImport(e, 'tourists')}
                          style={{ display: 'none' }}
                          id="import-tourists"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => document.getElementById('import-tourists')?.click()}
                          disabled={isImporting && importType === 'tourists'}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          {isImporting && importType === 'tourists' ? 'Importing...' : 'Choose File'}
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2 p-4 border rounded-lg">
                        <p className="font-medium text-sm">Import Boats</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleImport(e, 'boats')}
                          style={{ display: 'none' }}
                          id="import-boats"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => document.getElementById('import-boats')?.click()}
                          disabled={isImporting && importType === 'boats'}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          {isImporting && importType === 'boats' ? 'Importing...' : 'Choose File'}
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2 p-4 border rounded-lg">
                        <p className="font-medium text-sm">Import Trips</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleImport(e, 'trips')}
                          style={{ display: 'none' }}
                          id="import-trips"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => document.getElementById('import-trips')?.click()}
                          disabled={isImporting && importType === 'trips'}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          {isImporting && importType === 'trips' ? 'Importing...' : 'Choose File'}
                        </Button>
                      </div>
                    </div>
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
                    <Select 
                      value={formData.retention_period || 'never'}
                      onValueChange={(value) => handleChange('retention_period', value)}
                    >
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
                    <Switch 
                      id="auto-backup" 
                      checked={formData.auto_backup !== false}
                      onCheckedChange={(checked) => handleChange('auto_backup', checked)}
                    />
                    <Label htmlFor="auto-backup">Enable automatic weekly backups</Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-300 dark:border-red-800">
                <CardHeader className="border-b border-red-200 dark:border-red-800">
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    ⚠️ These actions are irreversible. Proceed with extreme caution!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Clear specific tables or all database records. A backup will be created automatically before clearing all data.
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <p className="font-medium text-sm">Clear Tourists</p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleClearTable('tourists')}
                          disabled={isClearing}
                        >
                          {isClearing ? 'Clearing...' : 'Clear'}
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <p className="font-medium text-sm">Clear Boats</p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleClearTable('boats')}
                          disabled={isClearing}
                        >
                          {isClearing ? 'Clearing...' : 'Clear'}
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <p className="font-medium text-sm">Clear Trips</p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleClearTable('trips')}
                          disabled={isClearing}
                        >
                          {isClearing ? 'Clearing...' : 'Clear'}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 border border-red-300 dark:border-red-800 rounded-lg bg-red-50/30 dark:bg-red-950/20">
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold text-red-600 dark:text-red-500 mb-2">🚨 CLEAR ALL DATA</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            This will delete ALL tourists, boats, and trips from your database. 
                            An automatic backup will be created first.
                          </p>
                        </div>
                        
                        {!showClearDialog ? (
                          <Button 
                            variant="destructive"
                            onClick={() => setShowClearDialog(true)}
                            className="w-full"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Clear All Records
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="clear-confirm">
                                Type <span className="font-mono font-bold">DELETE ALL DATA</span> to confirm:
                              </Label>
                              <Input
                                id="clear-confirm"
                                value={clearConfirmText}
                                onChange={(e) => setClearConfirmText(e.target.value)}
                                placeholder="DELETE ALL DATA"
                                className="font-mono"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                onClick={handleClearAllRecords}
                                disabled={clearConfirmText !== 'DELETE ALL DATA' || isClearing}
                                className="flex-1"
                              >
                                {isClearing ? 'Clearing...' : 'Confirm Clear All'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowClearDialog(false)
                                  setClearConfirmText('')
                                }}
                                disabled={isClearing}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
                      <Switch 
                        checked={formData.notify_new_tourist !== false}
                        onCheckedChange={(checked) => handleChange('notify_new_tourist', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Summary Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive daily statistics summary at 6:00 PM
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notify_daily_summary !== false}
                        onCheckedChange={(checked) => handleChange('notify_daily_summary', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Analytics Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Get weekly analytics every Monday
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notify_weekly_analytics || false}
                        onCheckedChange={(checked) => handleChange('notify_weekly_analytics', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Boat Capacity Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Alert when a boat is near maximum capacity
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notify_boat_capacity !== false}
                        onCheckedChange={(checked) => handleChange('notify_boat_capacity', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Maintenance</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about system updates and maintenance
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notify_system_maintenance !== false}
                        onCheckedChange={(checked) => handleChange('notify_system_maintenance', checked)}
                      />
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
                    <Label htmlFor="notification-emails">Notification Email Addresses</Label>
                    <Textarea 
                      id="notification-emails" 
                      placeholder="admin@municipality.gov.ph, staff@municipality.gov.ph"
                      rows={3}
                      value={formData.notification_emails || ''}
                      onChange={(e) => handleChange('notification_emails', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter email addresses separated by commas
                    </p>
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
                      <Select 
                        value={formData.date_format || 'mdy'}
                        onValueChange={(value) => handleChange('date_format', value)}
                      >
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
                      <Select 
                        value={formData.number_format || 'comma'}
                        onValueChange={(value) => handleChange('number_format', value)}
                      >
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
                      <Select 
                        value={String(formData.items_per_page || 10)}
                        onValueChange={(value) => handleChange('items_per_page', parseInt(value))}
                      >
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
                      <Select 
                        value={formData.default_view || 'overview'}
                        onValueChange={(value) => handleChange('default_view', value)}
                      >
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
                      <Switch 
                        id="show-charts" 
                        checked={formData.show_charts !== false}
                        onCheckedChange={(checked) => handleChange('show_charts', checked)}
                      />
                      <Label htmlFor="show-charts">Show charts on dashboard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="compact-mode" 
                        checked={formData.compact_mode || false}
                        onCheckedChange={(checked) => handleChange('compact_mode', checked)}
                      />
                      <Label htmlFor="compact-mode">Compact mode (reduced spacing)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="animations" 
                        checked={formData.enable_animations !== false}
                        onCheckedChange={(checked) => handleChange('enable_animations', checked)}
                      />
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
                    <Select 
                      value={String(formData.session_timeout || 30)}
                      onValueChange={(value) => handleChange('session_timeout', parseInt(value))}
                    >
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
                    <Switch 
                      id="auto-logout" 
                      checked={formData.auto_logout !== false}
                      onCheckedChange={(checked) => handleChange('auto_logout', checked)}
                    />
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
                      <Select 
                        value={formData.report_format || 'pdf'}
                        onValueChange={(value) => handleChange('report_format', value)}
                      >
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
                      <Select 
                        value={formData.report_orientation || 'portrait'}
                        onValueChange={(value) => handleChange('report_orientation', value)}
                      >
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
                    <Switch 
                      id="include-logo" 
                      checked={formData.report_include_logo !== false}
                      onCheckedChange={(checked) => handleChange('report_include_logo', checked)}
                    />
                    <Label htmlFor="include-logo">Include office logo in reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="include-charts" 
                      checked={formData.report_include_charts !== false}
                      onCheckedChange={(checked) => handleChange('report_include_charts', checked)}
                    />
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
                      <Switch 
                        checked={formData.auto_report_daily !== false}
                        onCheckedChange={(checked) => handleChange('auto_report_daily', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated every Monday at 8:00 AM
                        </p>
                      </div>
                      <Switch 
                        checked={formData.auto_report_weekly !== false}
                        onCheckedChange={(checked) => handleChange('auto_report_weekly', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monthly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated on the 1st of each month
                        </p>
                      </div>
                      <Switch 
                        checked={formData.auto_report_monthly !== false}
                        onCheckedChange={(checked) => handleChange('auto_report_monthly', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Annual Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Generated on January 1st
                        </p>
                      </div>
                      <Switch 
                        checked={formData.auto_report_annual || false}
                        onCheckedChange={(checked) => handleChange('auto_report_annual', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>Reset to Defaults</Button>
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
