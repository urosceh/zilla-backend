-- liquibase formatted sql
-- changeset uros:create-admin-user-table
CREATE TABLE IF NOT EXISTS "admin_user" (
  admin_user_id UUID PRIMARY KEY NOT NULL REFERENCES "zilla_user"(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
