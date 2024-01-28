-- liquibase formatted sql
-- changeset uros:create-user-project-access-table
CREATE TABLE IF NOT EXISTS "user_project_access" (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES "zilla_user"(user_id),
  project_key TEXT NOT NULL REFERENCES "project"(project_key)
);