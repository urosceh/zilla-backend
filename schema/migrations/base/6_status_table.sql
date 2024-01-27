-- liquibase formatted sql
-- changeset uros:create-issue-status-table
CREATE TABLE IF NOT EXISTS "issue_status" (
  id SERIAL PRIMARY KEY,
  status_name TEXT NOT NULL UNIQUE
);

-- changeset uros:create-project-status-order-table
CREATE TABLE IF NOT EXISTS "project_status_order" (
  id SERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES "project"(project_id),
  status_order INTEGER[] NOT NULL
);