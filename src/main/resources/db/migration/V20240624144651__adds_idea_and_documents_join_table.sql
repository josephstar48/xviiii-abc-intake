CREATE TABLE idea_documents (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    idea_id int,
    document_id int
);