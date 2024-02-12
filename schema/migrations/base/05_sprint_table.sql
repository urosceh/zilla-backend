-- liquibase formatted sql
-- changeset uros:create-sprint-table
CREATE TABLE IF NOT EXISTS "sprint" (
  sprint_id SERIAL PRIMARY KEY,
  sprint_name TEXT NOT NULL,
  project_key TEXT NOT NULL REFERENCES "project"(project_key) ON DELETE CASCADE,
  start_of_sprint TIMESTAMP NOT NULL,
  end_of_sprint TIMESTAMP NOT NULL
);

-- chaneset uros:create-sprint-table-unique-constraint
ALTER TABLE "sprint" ADD UNIQUE (project_key, sprint_name);