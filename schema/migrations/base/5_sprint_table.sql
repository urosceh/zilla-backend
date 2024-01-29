-- liquibase formatted sql
-- changeset uros:create-sprint-table
CREATE TABLE IF NOT EXISTS "sprint" (
  sprint_id SERIAL PRIMARY KEY,
  sprint_name TEXT NOT NULL UNIQUE,
  project_id UUID NOT NULL REFERENCES "project"(project_id),
  start_of_sprint TIMESTAMP NOT NULL,
  end_of_sprint TIMESTAMP NOT NULL
);