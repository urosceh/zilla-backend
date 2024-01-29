-- liquibase formatted sql
-- changeset uros:create-issue-table
CREATE TABLE IF NOT EXISTS "issue" (
  issue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES "project"(project_id),
  assignee_id UUID NULL REFERENCES "zilla_user"(user_id),
  reporter_id UUID NOT NULL REFERENCES "zilla_user"(user_id),
  status_id INTEGER NOT NULL REFERENCES "issue_status"(id),
  summary TEXT NOT NULL UNIQUE,
  details TEXT NULL,
  sprint_id INTEGER NULL REFERENCES "sprint"(sprint_id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);