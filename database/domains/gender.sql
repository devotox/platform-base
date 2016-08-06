CREATE DOMAIN gender CHAR(1)
CHECK (value IN ( 'F' , 'M' ) );
