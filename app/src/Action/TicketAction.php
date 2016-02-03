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

    /**
     * @param Twig $view
     */
    public function __construct(Twig $view)
    {
        $this->view = $view;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function load(Request $request, Response $response, $args)
    {
        $this->render( $response);
        return $response;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function save(Request $request, Response $response, $args)
    {
        $this->render( $response);
        return $response;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function remove(Request $request, Response $response, $args)
    {
        return $response;
    }

    /**
     * @param Response $response
     */
    private function render(Response $response)
    {
        $this->view->render($response, 'default/ticket.twig', [
                'title'=>'title',
                'content'=>'content'
            ]);
    }
}
