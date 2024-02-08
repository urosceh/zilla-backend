-- liquibase formatted sql
-- changeset uros:00_add_unique_userId_projectKey_to_access_table
ALTER TABLE user_project_access ADD CONSTRAINT unique_user_id_project_key UNIQUE (user_id, project_key);