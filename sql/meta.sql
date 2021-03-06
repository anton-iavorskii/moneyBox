CREATE ROLE guest WITH
  NOLOGIN
  NOSUPERUSER
  NOINHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE admin WITH
  NOLOGIN
  NOSUPERUSER
  NOINHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE "user" WITH
  NOLOGIN
  NOSUPERUSER
  NOINHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE moneybox WITH
  LOGIN
  SUPERUSER
  NOINHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD 'money';

CREATE DATABASE "moneyboxDB"
    WITH 
    OWNER = moneybox
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

ALTER DEFAULT PRIVILEGES
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLES TO admin;

ALTER DEFAULT PRIVILEGES
GRANT ALL ON TABLES TO moneybox;

ALTER DEFAULT PRIVILEGES
GRANT ALL ON TABLES TO postgres;

ALTER DEFAULT PRIVILEGES
GRANT DELETE, UPDATE, SELECT, INSERT ON TABLES TO "user";

\connect "moneyboxDB"

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";