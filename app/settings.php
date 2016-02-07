<?php
return [
    'settings' => [
        // Slim Settings
        'determineRouteBeforeAppMiddleware' => false,
        'displayErrorDetails' => true,
        // View settings
        'view' => [
            'template_path' => __DIR__.'/../app/templates',
            'twig' => [
                'cache' => __DIR__.'/../cache/twig',
                'debug' => true,
                'auto_reload' => true,
            ],
        ],
        'doctrine' => [
            'meta' => [
                'entity_path' => [
                    'app/src/Entity'
                ],
                'auto_generate_proxies' => true,
                'proxy_dir' =>  __DIR__.'/../cache/proxies',
                'cache' => null,
            ],
            'connection' => [
                'driver'   => 'pdo_mysql',
                'host'     => 'localhost',
                'dbname'   => 'todolist',
                'user'     => 'exaGroup',
                'password' => 'pandaTest',
            ]
        ],
    ],
];
