UPDATE innovation_cell
SET name = 'XVIII ABC / JIOP',
    title = 'Corps Innovation Intake and Rapid Prototyping Lane',
    description = 'Corps-level intake for JIOP and cross-division operational challenges. Routes Soldier-led problems for scoping, prototyping, testing, and delivery across the XVIII Airborne Corps innovation pathway.'
WHERE name = 'XVIII ABC / JIOP / ODS';

INSERT INTO innovation_cell(name, title, description, email, phone, address)
SELECT
    'XVIII ABC / ODS',
    'Operational Data and Software Lane',
    'Corps-level lane for software applications, data products, dashboards, analytics, automation, AI-enabled workflows, and digital capability reuse across the formation.',
    'dragoninnovations@army.mil',
    '+1 (910) 000-0000',
    'Operational Data Software lane, XVIII Airborne Corps, Fort Liberty, NC'
WHERE NOT EXISTS (
    SELECT 1 FROM innovation_cell WHERE name = 'XVIII ABC / ODS'
);

INSERT INTO innovation_cell_tags(innovation_cell_id, tag_id)
SELECT innovation_cell.id, tag.id
FROM innovation_cell
JOIN tag ON tag.name IN ('SOFTWARE', 'DATA', 'AI/ML')
WHERE innovation_cell.name = 'XVIII ABC / ODS'
AND NOT EXISTS (
    SELECT 1
    FROM innovation_cell_tags
    WHERE innovation_cell_tags.innovation_cell_id = innovation_cell.id
    AND innovation_cell_tags.tag_id = tag.id
);
