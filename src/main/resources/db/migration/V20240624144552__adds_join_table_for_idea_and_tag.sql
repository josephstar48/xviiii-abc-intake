CREATE TABLE idea_tags (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    idea_id int,
    tag_id int
);