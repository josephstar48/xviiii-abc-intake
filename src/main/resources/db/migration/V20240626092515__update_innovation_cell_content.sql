UPDATE innovation_cell
SET email       = CASE
                      WHEN id = 1 THEN 'usasoc@socom.mil'
                      WHEN id = 2 THEN 'aidiv.mil@socom.mil'
                      WHEN id = 3 THEN '1SFC@socom.mil'
                      WHEN id = 4 THEN 'swcs@swcs.socom.mil'
                      WHEN id = 5 THEN 'info.mil@swf.army.mil'
                      WHEN id = 6 THEN 'dragonslair.mil@army.mil'
                      WHEN id = 7 THEN 'eagle.werx.mil@army.mil'
                      WHEN id = 8 THEN 'lightning.labs.mil@army.mil'
    END,
    phone       = CASE
                      WHEN id = 1 THEN '+1 (622) 861-4376'
                      WHEN id = 2 THEN '+1 (703) 870-7818'
                      WHEN id = 3 THEN '+1 (678) 314-3458'
                      WHEN id = 4 THEN '+1 (485) 697-5513'
                      WHEN id = 5 THEN '+1 (238) 761-4509'
                      WHEN id = 6 THEN '+1 (901) 893-1363'
                      WHEN id = 7 THEN '+1 (532) 958-8082'
                      WHEN id = 8 THEN '+1 (446) 444-9269'
        END,
    title       = CASE
                      WHEN id = 1 THEN 'Science and Technology Division'
                      WHEN id = 2 THEN 'Enabling SOF Missions through AI/ML'
                      WHEN id = 3 THEN '1st Special Forces Command (Airborne)'
                      WHEN id = 4 THEN 'Robotics and Unmanned Systems Integration Course (RUSIC)'
                      WHEN id = 5 THEN 'Army Software Factory'
                      WHEN id = 6 THEN 'Dragons Lair Innovation Center'
                      WHEN id = 7 THEN 'EagleWerx'
                      WHEN id = 8 THEN 'Lightning Labs'
        END,
    description = CASE
                      WHEN id = 1
                          THEN 'Science and Technology (S&T) Division is to ensure that Army Special Operations Forces (ARSOF) maintain a decisive technological advantage on the battlefield'
                      WHEN id = 2
                          THEN 'Accelerate the delivery of AI enabled capabilities to USASOC. AI/ML capabilities empower SOF for integrated operations in the physical, virtual, and cognitive realms.'
                      WHEN id = 3
                          THEN 'Assigns, equips, trains, certifies, and validates ARSOF Soldiers and units to conduct global operations in support of theater and national objectives'
                      WHEN id = 4
                          THEN 'Preparing for the future, trains operators on advanced UxS Systems and operations.'
                      WHEN id = 5
                          THEN 'Prototyping a future force design, Soldiers from all backgrounds shape how the Army navigates the digital frontier through software solutions.'
                      WHEN id = 6
                          THEN 'The official platform for Dragon’s Lair 10, XVIII Airborne Corp’s innovation competition in partnership with United States European Command.'
                      WHEN id = 7
                          THEN 'The 101st Division Innovation to connect Warfighters and innovators o submit, monitor, and advance problem statements through innovation  to produce results.'
                      WHEN id = 8
                          THEN 'Transform 25ID problems into opportunities.  Lightning Labs links problem aggregation and innovation a to a strategically curated network of academic and industry partners.'
        END,
    name        = CASE
                      WHEN id = 1 THEN 'USASOC'
                      WHEN id = 2 THEN 'USASOC AI Division'
                      WHEN id = 3 THEN '1st SFC (A)'
                      WHEN id = 4 THEN 'SWCS'
                      WHEN id = 5 THEN 'ASWF'
                      WHEN id = 6 THEN 'XVII ABN CORPS'
                      WHEN id = 7 THEN '101st Airborne'
                      WHEN id = 8 THEN '25th ID'
        END
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8);
