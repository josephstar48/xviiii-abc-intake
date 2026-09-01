CREATE TABLE innovation_cell (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(128),
    email varchar(128),
    phone varchar(64)
)