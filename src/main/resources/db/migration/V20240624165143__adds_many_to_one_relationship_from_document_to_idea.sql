ALTER TABLE document
DROP COLUMN url;

ALTER TABLE document
ADD COLUMN path varchar(1024);
