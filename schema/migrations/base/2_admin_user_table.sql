-- liquibase formatted sql
-- changeset uros:create-admin-user-table
CREATE TABLE IF NOT EXISTS "admin_user" (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_user_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "zilla_user"(user_id)
);
