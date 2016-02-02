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
    private $view;

    public function __construct(Twig $view)
    {
        $this->view = $view;
    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $this->view->render($response, 'base.twig');
        return $response;
    }
}
