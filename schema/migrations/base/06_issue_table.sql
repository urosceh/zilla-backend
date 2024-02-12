-- liquibase formatted sql
-- changeset uros:create-issue-status-type
CREATE TYPE issue_status_enum AS ENUM (
  'Backlog',
  'In Progress',
  'In Review',
  'Deployed',
  'Tested',
  'Done',
  'Rejected'
)

-- changeset uros:create-issue-table
CREATE TABLE IF NOT EXISTS "issue" (
  issue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_key TEXT NOT NULL REFERENCES "project"(project_key),
  assignee_id UUID NULL REFERENCES "zilla_user"(user_id),
  reporter_id UUID NOT NULL REFERENCES "zilla_user"(user_id),
  issue_status ISSUE_STATUS_ENUM NOT NULL,
  summary TEXT NOT NULL UNIQUE,
  details TEXT NULL,
  sprint_id INTEGER NULL REFERENCES "sprint"(sprint_id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- changeset uros:create-issue-table-indexes
CREATE INDEX IF NOT EXISTS "idx_issue_project_key" ON "issue"(project_key);
CREATE INDEX IF NOT EXISTS "idx_issue_assignee_id" ON "issue"(assignee_id);
CREATE INDEX IF NOT EXISTS "idx_issue_reporter_id" ON "issue"(reporter_id);
CREATE INDEX IF NOT EXISTS "idx_issue_sprint_id" ON "issue"(sprint_id);
CREATE INDEX IF NOT EXISTS "idx_issue_issue_status" ON "issue"(issue_status);
