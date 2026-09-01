CREATE TABLE submitter (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(64),
    last_name varchar(64),
    unit varchar(128),
    email varchar(128),
    phone varchar(64)
);