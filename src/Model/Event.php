<?php
namespace App\Model;

use App\Service\Config;

class Event
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $content = null;
    private ?string $date = null; // new

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Event
    {
        $this->id = $id;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): Event
    {
        $this->subject = $subject;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Event
    {
        $this->content = $content;

        return $this;
    }

    public function getDate(): ?string
    {
        return $this->date;
    }

    public function setDate(?string $date): Event
    {
        $this->date = $date;
        echo $date;
        return $this;
    }

    public static function fromArray($array): Event
    {
        $event = new self();
        $event->fill($array);

        return $event;
    }

    public function fill($array): Event
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }
        if (isset($array['date'])) {
            $this->setDate($array['date']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM event';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $events = [];
        $eventsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($eventsArray as $eventArray) {
            $events[] = self::fromArray($eventArray);
        }

        return $events;
    }

    public static function find($id): ?Event
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM event WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $eventArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $eventArray) {
            return null;
        }
        $event = Event::fromArray($eventArray);

        return $event;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO event (subject, content, date) VALUES (:subject, :content, :date)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'subject' => $this->getSubject(),
                'content' => $this->getContent(),
                'date' => $this->getDate(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE event SET subject = :subject, content = :content , date = :date WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':subject' => $this->getSubject(),
                ':content' => $this->getContent(),
                ':date' => $this->getDate(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM event WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setContent(null);
        $this->setDate(null);
    }
}
