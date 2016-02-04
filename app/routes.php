<?php
// Routes

$app->get('/', 'App\Action\HomeAction:dispatch')
    ->setName('homePage');

$app->get('/ticket', 'App\Action\TicketAction:liste')
    ->setName('tickets-list');

$app->get('/ticket/load', 'App\Action\TicketAction:load')
    ->setName('ticket-load');

$app->post('/ticket/save', 'App\Action\TicketAction:save')
    ->setName('ticket-save');

$app->delete('/ticket/remove', 'App\Action\TicketAction:remove')
    ->setName('ticket-remove');
