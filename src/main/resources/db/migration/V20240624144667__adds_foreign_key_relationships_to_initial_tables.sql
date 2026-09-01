ALTER TABLE idea
    ADD CONSTRAINT fk_idea_innovation_cell
        FOREIGN KEY (innovation_cell_id)
            REFERENCES innovation_cell (id);

ALTER TABLE idea
    ADD CONSTRAINT fk_idea_submitter
        FOREIGN KEY (submitter_id)
            REFERENCES submitter (id);