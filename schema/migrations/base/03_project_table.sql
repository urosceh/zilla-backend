-- liquibase formatted sql
-- changeset uros:create-project-table
CREATE TABLE IF NOT EXISTS "project" (
    project_id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL UNIQUE,
    project_key TEXT NOT NULL UNIQUE,
    manager_id UUID NOT NULL REFERENCES "zilla_user"(user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);