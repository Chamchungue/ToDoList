<?php
// Routes

$app->get('/', 'App\Action\HomeAction:dispatch')
    ->setName('homePage');

$app->get('/ticket', 'App\Action\TicketAction:liste')
    ->setName('tickets-list');

$app->put('/ticket/save', 'App\Action\TicketAction:save')
    ->setName('ticket-save');

$app->delete('/ticket/remove', 'App\Action\TicketAction:remove')
    ->setName('ticket-remove');

$app->get('/phpInfo', function($request, $response) use($app) {
        if($_SERVER["REMOTE_ADDR"] == '192.168.1.37') {
            phpinfo();
        } else {
            $response->getHeader()->withStatus(500, 'Ressource interdite');
        }
    })->setName('phpInfo');