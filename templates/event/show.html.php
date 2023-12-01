<?php

/** @var \App\Model\Event $event */
/** @var \App\Service\Router $router */

$title = "{$event->getSubject()} ({$event->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $event->getSubject() ?></h1>
    <article>
        <?= $event->getContent();?>
    </article>
    <h3><?= $event->getDate() ?></h3>
    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('event-index') ?>">Back to Events</a></li>
        <li><a href="<?= $router->generatePath('event-edit', ['id'=> $event->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
