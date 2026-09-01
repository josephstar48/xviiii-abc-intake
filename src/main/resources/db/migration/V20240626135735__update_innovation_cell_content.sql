UPDATE innovation_cell
SET address = CASE
                  WHEN id = 1 THEN '2929 Desert Storm Dr Fort Liberty, North Carolina 28303'
                  WHEN id = 2 THEN '1105 El Salvador St Fort Liberty, North Carolina 28303'
                  WHEN id = 3 THEN '1624-1626 Rock Merritt Ave Fort Liberty, North Carolina 28303'
                  WHEN id = 4 THEN '1401-1415 Funston St Fort Liberty, North Carolina 28303'
                  WHEN id = 5 THEN '1212 Rio Grande St Austin, Texas 78701'
                  WHEN id = 6 THEN '3560 Hurst Dr. Pope Field, NC 28308'
                  WHEN id = 7 THEN '89 Screaming Eagle Blvd, Fort Campbell, KY 42223'
                  WHEN id = 8 THEN '580 Kolekole Ave, Schofield Barracks, HI 96857'
    END
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8);
