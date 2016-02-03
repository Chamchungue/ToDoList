<?php
// Routes

$app->get('/', 'App\Action\HomeAction:dispatch')
    ->setName('homepage');

$app->get('/ticket', 'App\Action\TicketAction:load')
    ->setName('ticket');
