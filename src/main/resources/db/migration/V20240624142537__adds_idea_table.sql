CREATE TABLE idea (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(256),
    problem_statement varchar(1024),
    problem_context varchar(1024),
    solution_benefits varchar(1024),
    solution_concepts varchar(1024),
    submitter_id int,
    innovation_cell_id int,
    stage int
);