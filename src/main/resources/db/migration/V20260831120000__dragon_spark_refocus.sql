ALTER TABLE idea
ADD COLUMN unit_division VARCHAR(128),
ADD COLUMN problem_type VARCHAR(128),
ADD COLUMN operational_impact VARCHAR(128),
ADD COLUMN urgency VARCHAR(64),
ADD COLUMN capability_lane VARCHAR(128),
ADD COLUMN routing_notes VARCHAR(512);

DELETE FROM innovation_cell_tags;
UPDATE idea SET innovation_cell_id = NULL WHERE innovation_cell_id > 5;
DELETE FROM innovation_cell WHERE id > 5;

UPDATE innovation_cell
SET name = CASE
        WHEN id = 1 THEN 'XVIII ABC / JIOP / ODS'
        WHEN id = 2 THEN '82nd Airborne Division / Airborne Innovation Lab'
        WHEN id = 3 THEN '101st Airborne Division / EagleWerx'
        WHEN id = 4 THEN '10th Mountain Division / MISIL'
        WHEN id = 5 THEN '3rd Infantry Division / Transformation Cell'
    END,
    title = CASE
        WHEN id = 1 THEN 'Corps Software, Data, and Rapid Prototyping Lane'
        WHEN id = 2 THEN 'Airborne Innovation Lab'
        WHEN id = 3 THEN 'EagleWerx Applied Tactical Innovation Center'
        WHEN id = 4 THEN 'Mountain Innovation and Systems Integration Lab'
        WHEN id = 5 THEN 'Division Transformation and Innovation Cell'
    END,
    description = CASE
        WHEN id = 1 THEN 'Corps-level intake for JIOP, ODS, and Operational Data Teams. Routes software, data, AI, and cross-division operational challenges to the XVIII Airborne Corps innovation pathway.'
        WHEN id = 2 THEN 'Fort Liberty innovation lane for 82nd Airborne Division Paratrooper problems, makerspace prototyping, tactical gear, and airborne formation needs.'
        WHEN id = 3 THEN 'Fort Campbell innovation lane for 101st Airborne Division air assault problems, hardware customization, additive manufacturing, UAS, robotics, and tactical integration.'
        WHEN id = 4 THEN 'Fort Drum innovation lane for 10th Mountain Division light infantry problems, rugged terrain, cold-weather gear, lightweight systems, and mountain operations.'
        WHEN id = 5 THEN 'Fort Stewart innovation lane for 3rd Infantry Division mechanized, armored, vehicle-mounted, and transformation-in-contact problems.'
    END,
    email = CASE
        WHEN id = 1 THEN 'dragoninnovations@army.mil'
        WHEN id = 2 THEN 'ail@army.mil'
        WHEN id = 3 THEN 'eaglewerx@army.mil'
        WHEN id = 4 THEN 'misil@army.mil'
        WHEN id = 5 THEN 'marneinnovations@army.mil'
    END,
    phone = CASE
        WHEN id = 1 THEN '+1 (910) 000-0000'
        WHEN id = 2 THEN '+1 (910) 000-0000'
        WHEN id = 3 THEN '+1 (270) 000-0000'
        WHEN id = 4 THEN '+1 (315) 000-0000'
        WHEN id = 5 THEN '+1 (912) 000-0000'
    END,
    address = CASE
        WHEN id = 1 THEN 'Lt. Gen. James M. Gavin Joint Innovation Outpost, Fort Liberty, NC'
        WHEN id = 2 THEN 'Airborne Innovation Lab, Fort Liberty, NC'
        WHEN id = 3 THEN 'EagleWerx, Fort Campbell, KY'
        WHEN id = 4 THEN 'MISIL, Fort Drum, NY'
        WHEN id = 5 THEN 'Fort Stewart, GA'
    END
WHERE id IN (1, 2, 3, 4, 5);

INSERT INTO tag(name)
SELECT lane FROM (VALUES
    ('DATA'),
    ('HARDWARE'),
    ('TRAINING'),
    ('SUSTAINMENT')
) AS lanes(lane)
WHERE NOT EXISTS (SELECT 1 FROM tag WHERE tag.name = lanes.lane);

INSERT INTO innovation_cell_tags(innovation_cell_id, tag_id)
SELECT cell_id, tag.id
FROM (VALUES
    (1, 'SOFTWARE'), (1, 'DATA'), (1, 'AI/ML'),
    (2, 'MANUFACTURING'), (2, 'HARDWARE'), (2, 'TRAINING'),
    (3, 'UAV/ROBOTICS'), (3, 'MANUFACTURING'), (3, 'HARDWARE'),
    (4, 'HARDWARE'), (4, 'SUSTAINMENT'), (4, 'TRAINING'),
    (5, 'HARDWARE'), (5, 'DATA'), (5, 'SUSTAINMENT')
) AS mapped(cell_id, tag_name)
JOIN tag ON tag.name = mapped.tag_name;
