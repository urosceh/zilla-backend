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

-- changeset uros:create-project-table-indexes
CREATE INDEX IF NOT EXISTS "idx_project_project_name" ON "project"(project_name);
CREATE INDEX IF NOT EXISTS "idx_project_project_key" ON "project"(project_key);
CREATE INDEX IF NOT EXISTS "idx_project_manager_id" ON "project"(manager_id);