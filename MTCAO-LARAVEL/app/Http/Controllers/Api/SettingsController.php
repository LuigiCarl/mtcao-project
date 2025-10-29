<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->groupBy('group')->map(function ($group) {
            return $group->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->value];
            });
        });

        return response()->json($settings);
    }

    /**
     * Get settings by group
     */
    public function getByGroup(string $group): JsonResponse
    {
        $settings = Setting::where('group', $group)->get()->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        });

        return response()->json($settings);
    }

    /**
     * Update settings
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'sometimes|string|in:string,boolean,integer,json',
            'settings.*.group' => 'sometimes|string',
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::set(
                $settingData['key'],
                $settingData['value'],
                $settingData['type'] ?? 'string',
                $settingData['group'] ?? 'general'
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => Setting::getAll()
        ]);
    }

    /**
     * Update a single setting
     */
    public function updateSingle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'nullable',
            'type' => 'sometimes|string|in:string,boolean,integer,json',
            'group' => 'sometimes|string',
        ]);

        $setting = Setting::set(
            $validated['key'],
            $validated['value'],
            $validated['type'] ?? 'string',
            $validated['group'] ?? 'general'
        );

        return response()->json([
            'message' => 'Setting updated successfully',
            'setting' => $setting
        ]);
    }

    /**
     * Reset settings to default
     */
    public function reset(): JsonResponse
    {
        // Delete all settings
        Setting::truncate();

        // Re-seed default settings
        Artisan::call('db:seed', ['--class' => 'SettingsSeeder']);

        return response()->json([
            'message' => 'Settings reset to defaults',
            'settings' => Setting::getAll()
        ]);
    }

    /**
     * Export settings
     */
    public function export(): JsonResponse
    {
        $settings = Setting::all();

        return response()->json([
            'settings' => $settings,
            'exported_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Import settings
     */
    public function import(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'] ?? 'string',
                    'group' => $setting['group'] ?? 'general'
                ]
            );
        }

        return response()->json([
            'message' => 'Settings imported successfully',
            'count' => count($validated['settings'])
        ]);
    }
}

