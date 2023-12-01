create table event
(
    id      integer not null
        constraint event_pk
            primary key autoincrement,
    subject text not null,
    content text not null,
    date text not null
);