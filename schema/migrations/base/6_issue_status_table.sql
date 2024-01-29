-- liquibase formatted sql
-- changeset uros:create-issue-status-table
CREATE TABLE IF NOT EXISTS "issue_status" (
  id SERIAL PRIMARY KEY,
  status_name TEXT NOT NULL UNIQUE
);