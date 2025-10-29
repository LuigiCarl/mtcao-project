<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General Settings
            ['key' => 'office_name', 'value' => 'Municipal Tourism Culture and Arts Office', 'type' => 'string', 'group' => 'general'],
            ['key' => 'municipality', 'value' => 'Your Municipality', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'tourism@municipality.gov.ph', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_phone', 'value' => '+63 XXX XXX XXXX', 'type' => 'string', 'group' => 'general'],
            ['key' => 'office_address', 'value' => 'Municipal Hall, Main Street', 'type' => 'string', 'group' => 'general'],
            ['key' => 'timezone', 'value' => 'Asia/Manila', 'type' => 'string', 'group' => 'general'],
            ['key' => 'currency', 'value' => 'PHP', 'type' => 'string', 'group' => 'general'],
            ['key' => 'language', 'value' => 'en', 'type' => 'string', 'group' => 'general'],
            ['key' => 'opening_time', 'value' => '08:00', 'type' => 'string', 'group' => 'general'],
            ['key' => 'closing_time', 'value' => '17:00', 'type' => 'string', 'group' => 'general'],
            ['key' => 'open_weekends', 'value' => '0', 'type' => 'boolean', 'group' => 'general'],
            
            // Data Management
            ['key' => 'retention_period', 'value' => 'never', 'type' => 'string', 'group' => 'data'],
            ['key' => 'auto_backup', 'value' => '1', 'type' => 'boolean', 'group' => 'data'],
            
            // Notifications
            ['key' => 'notify_new_tourist', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'notify_daily_summary', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'notify_weekly_analytics', 'value' => '0', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'notify_boat_capacity', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'notify_system_maintenance', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'notification_emails', 'value' => 'admin@municipality.gov.ph', 'type' => 'string', 'group' => 'notifications'],
            
            // Display Preferences
            ['key' => 'date_format', 'value' => 'mdy', 'type' => 'string', 'group' => 'display'],
            ['key' => 'number_format', 'value' => 'comma', 'type' => 'string', 'group' => 'display'],
            ['key' => 'items_per_page', 'value' => '10', 'type' => 'integer', 'group' => 'display'],
            ['key' => 'default_view', 'value' => 'overview', 'type' => 'string', 'group' => 'display'],
            ['key' => 'show_charts', 'value' => '1', 'type' => 'boolean', 'group' => 'display'],
            ['key' => 'compact_mode', 'value' => '0', 'type' => 'boolean', 'group' => 'display'],
            ['key' => 'enable_animations', 'value' => '1', 'type' => 'boolean', 'group' => 'display'],
            
            // Security
            ['key' => 'session_timeout', 'value' => '30', 'type' => 'integer', 'group' => 'security'],
            ['key' => 'auto_logout', 'value' => '1', 'type' => 'boolean', 'group' => 'security'],
            ['key' => 'two_factor_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'security'],
            
            // Reports
            ['key' => 'report_format', 'value' => 'pdf', 'type' => 'string', 'group' => 'reports'],
            ['key' => 'report_orientation', 'value' => 'portrait', 'type' => 'string', 'group' => 'reports'],
            ['key' => 'report_include_logo', 'value' => '1', 'type' => 'boolean', 'group' => 'reports'],
            ['key' => 'report_include_charts', 'value' => '1', 'type' => 'boolean', 'group' => 'reports'],
            ['key' => 'auto_report_daily', 'value' => '1', 'type' => 'boolean', 'group' => 'reports'],
            ['key' => 'auto_report_weekly', 'value' => '1', 'type' => 'boolean', 'group' => 'reports'],
            ['key' => 'auto_report_monthly', 'value' => '1', 'type' => 'boolean', 'group' => 'reports'],
            ['key' => 'auto_report_annual', 'value' => '0', 'type' => 'boolean', 'group' => 'reports'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}

