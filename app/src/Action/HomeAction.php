<?php
namespace App\Action;

use Slim\Views\Twig;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * Class HomeAction
 * @package App\Action
 */
final class HomeAction
{
    /**
     * @var \Slim\Views\Twig
     */
    private $view;

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
    public function dispatch($request, $response, $args)
    {
        $this->view->render($response, 'html.twig');
        return $response;
    }
}
