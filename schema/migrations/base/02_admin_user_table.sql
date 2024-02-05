-- liquibase formatted sql
-- changeset uros:create-admin-user-table
CREATE TABLE IF NOT EXISTS "admin_user" (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES "zilla_user"(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
