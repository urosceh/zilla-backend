--liquibase formatted sql
--changeset uros:add-test-table
CREATE TABLE IF NOT EXISTS public.test  (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);