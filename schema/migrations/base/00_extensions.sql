-- liquibase formatted sql
-- changeset uros:add-uuid-extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- changeset uros:create-pgcrypto-extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;