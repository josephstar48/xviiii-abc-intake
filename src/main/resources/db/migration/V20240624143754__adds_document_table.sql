CREATE TABLE document (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(128),
    url varchar(1024)
);