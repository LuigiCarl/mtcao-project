<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Response Caching Configuration
    |--------------------------------------------------------------------------
    |
    | Configure cache settings for API responses
    |
    */

    'cache' => [
        // Cache duration in seconds
        'duration' => env('API_CACHE_DURATION', 300), // 5 minutes default

        // Redis cache for distributed caching
        'driver' => env('CACHE_DRIVER', 'file'),

        // Endpoints to cache (regex patterns)
        'endpoints' => [
            '/api/analytics' => 300,
            '/api/boats' => 600,
            '/api/tourists' => 300,
            '/api/reports' => 600,
        ],

        // Endpoints to exclude from caching
        'exclude' => [
            '/api/boats$' => false, // Allow GET but not POST/PUT/DELETE
            '/api/tourists$' => false,
        ],

        // Cache key prefix
        'prefix' => 'api_cache:',
    ],

    /*
    |--------------------------------------------------------------------------
    | Query Optimization
    |--------------------------------------------------------------------------
    */

    'optimization' => [
        // Enable query optimization
        'eager_loading' => true,
        'field_selection' => true,

        // Database connection pool settings
        'pool' => [
            'min' => 5,
            'max' => 30,
        ],

        // Query timeout in seconds
        'timeout' => 30,
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination Settings
    |--------------------------------------------------------------------------
    */

    'pagination' => [
        'per_page' => 20,
        'max_per_page' => 100,
    ],
];
