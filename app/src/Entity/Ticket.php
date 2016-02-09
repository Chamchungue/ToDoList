<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="Ticket", uniqueConstraints={@ORM\UniqueConstraint(name="ticket_id", columns={"id"})}))
 */
class Ticket
{
    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=70)
     */
    protected $summary;

    /**
     * @ORM\Column(type="string", length=300, nullable=true)
     */
    protected $description;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $createDate;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $dueDate;

    /**
     *
     */
    public function __construct()
    {
        $this->createDate = date_create();
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = utf8_encode($description);
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return str_replace('&lt;br/&gt;', '<br/>', htmlspecialchars($this->description));
    }

    /**
     * @param string $summary
     */
    public function setSummary($summary)
    {
        $this->summary = utf8_encode($summary);
    }

    /**
     * @return string
     */
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * @param \DateTime $dueDate
     */
    public function setDueDate($dueDate)
    {
        $this->dueDate = $dueDate;
    }

    /**
     * @return \DateTime
     */
    public function getDueDate()
    {
        return $this->dueDate;
    }

    /**
     * @return \DateTime
     */
    public function getCreateDate()
    {
        return $this->createDate;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }
}
