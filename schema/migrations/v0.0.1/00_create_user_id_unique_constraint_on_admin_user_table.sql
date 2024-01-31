-- liquibase formatted sql
-- changeset uros:create-user-id-unique-constraint-on-admin-user-table
ALTER TABLE "admin_user" ADD CONSTRAINT "user_id_unique" UNIQUE ("user_id");