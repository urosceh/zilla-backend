-- liquibase formatted sql
-- changeset uros:create-user-project-access-table
CREATE TABLE IF NOT EXISTS "user_project_access" (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES "zilla_user"(user_id) ON DELETE CASCADE,
  project_key TEXT NOT NULL REFERENCES "project"(project_key) ON DELETE CASCADE
);

-- changeset uros:create-user-project-access-table-index
CREATE INDEX IF NOT EXISTS "idx_user_project_access_project_key" ON "user_project_access"(project_key);