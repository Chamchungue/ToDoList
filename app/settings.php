<?php
return [
    'settings' => [
        // Slim Settings
        'determineRouteBeforeAppMiddleware' => false,
        'displayErrorDetails' => true,
        // View settings
        'view' => [
            'template_path' => ROOT_DIR . '/app/templates',
            'twig' => [
                'cache' => ROOT_DIR . '/cache/twig',
                'debug' => true,
                'auto_reload' => true,
            ],
        ],
    ],
];
