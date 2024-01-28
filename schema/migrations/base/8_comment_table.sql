-- liquibase formatted sql
-- changeset uros:create-comment-table
CREATE TABLE IF NOT EXISTS "comment" (
  comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES "issue"(issue_id),
  user_id UUID NOT NULL REFERENCES "zilla_user"(user_id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);