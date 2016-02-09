<?php
namespace App\Action;

use Doctrine\ORM\EntityNotFoundException;
use Slim\Views\Twig as Twig;
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Entity\Ticket as Ticket;
use Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper as EntityManagerHelper;

/**
 * Class TicketAction
 * @package App\Action
 */
class TicketAction
{
    /**
     * @var \Slim\Views\Twig
     */
    protected $view;
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected $em;

    /**
     * @param Twig $view
     * @param EntityManagerHelper $em
     */
    public function __construct(Twig $view, EntityManagerHelper $em)
    {
        $this->view = $view;
        $this->em = $em->getEntityManager();
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function liste(Request $request, Response $response, $args)
    {
        $tickets = $this->em->getRepository('App\Entity\Ticket')->findAll();
        /**
         * @var Ticket $ticket
         */
        foreach ($tickets as $ticket) {
            $this->render($response, $ticket);
        }
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
        $id = trim($request->getHeader('id')[0]);
        $summary = trim($request->getHeader('summary')[0]);
        $description = trim($request->getHeader('description')[0]);
        $dueDate = trim($request->getHeader('dueDate')[0]);

        if( !$summary) {
            $response->withStatus(500);
        } else {
            try{
                /**
                 * @var Ticket $ticket ;
                 */
                $ticket = null;
                if ($id) {
                    $ticket = $this->em->find('App\Entity\Ticket', $id);
                } else {
                    $ticket = new Ticket();
                }
                $ticket->setSummary($summary);
                $ticket->setDescription($description);
                $ticket->setDueDate($dueDate ? date_create_from_format('j/m/Y', $dueDate) : null);

                $this->em->persist($ticket);
                $this->em->flush();

                $this->render($response, $ticket);
            } catch( \Exception $e) {
                $response->withStatus(500);
            }
        }
        return $response;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function remove(Request $request, Response $response, $args)
    {
        foreach (explode(',', $request->getHeader('id')[0]) as $id) {
            $ticket = $this->em->find('App\Entity\Ticket', $id);
            if ($ticket) {
                $this->em->remove($ticket);
            } else {
                throw new EntityNotFoundException;
            }
        }
        $this->em->flush();
        return $response;
    }

    /**
     * @param Response $response
     * @param Ticket $ticket
     */
    protected function render(Response $response, Ticket $ticket)
    {
        $this->view->render(
            $response,
            'default/ticket.twig',
            [
                'ticket' => $ticket
            ]
        );
    }
}
