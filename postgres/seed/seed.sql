BEGIN TRANSACTION;
INSERT into users (name, email, entries, joined)
values ('Jessie', 'a@a.com', 5, '2021-01-01');
INSERT into login (hash, email)
values (
        '$2a$10$fTzpx8jEFqRofUOGIFt7HuhUu78zld.2Iu7qdCibDgA.gr9iqqbga',
        'a@a.com'
    );
COMMIT;