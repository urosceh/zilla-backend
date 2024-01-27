-- liquibase formatted sql
-- changeset uros:add-uuid-extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- changeset uros:create-pgcrypto-extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;