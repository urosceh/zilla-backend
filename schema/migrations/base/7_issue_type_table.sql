-- liquibase formatted sql
-- changeset uros:create-issue-type-table
CREATE TABLE IF NOT EXISTS "issue_type" (
  type_id SERIAL PRIMARY KEY,
  type_name TEXT NOT NULL UNIQUE
)