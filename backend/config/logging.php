<?php

return [
    'default' => env('LOG_CHANNEL', 'daily'),
    
    'channels' => [
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => 14,
            'replace_placeholders' => true,
        ],
        'admin_audit' => [
            'driver' => 'daily',
            'path' => storage_path('logs/admin_audit.log'),
            'level' => 'info',
            'days' => 14,
            'replace_placeholders' => true,
        ],
    ],
];
