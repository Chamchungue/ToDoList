<?php

namespace App\Action;

use Slim\Views\Twig as Twig;
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class TicketAction
{
    private $view;
    /**
     * @var string
     */
    public $summary;

    /**
     * @var string
     */
    public $description;

    /**
     * @var \DateTime
     */
    public $createDate;

    /**
     * @var \DateTime
     */
    public $dueDate;

    public function __construct(Twig $view)
    {
        $this->view = $view;
    }

    public function load(Request $request, Response $response, $args)
    {
        $this->view->render($response, 'ticket.twig');
        return $response;
    }

    public function save(Request $request, Response $response, $args)
    {
        $this->view->render($response, 'ticket.twig');
        return $response;
    }

    public function remove(Request $request, Response $response, $args)
    {
        $this->view->render($response, 'ticket.twig');
        return $response;
    }
}
