<?php
    /** @var $event ?\App\Model\Event */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="event[subject]" value="<?= $event ? $event->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="event[content]"><?= $event? $event->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="date">Date</label>
    <input type="date" id="date" name="event[date]" value="<?= $event ? $event->getDate() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
