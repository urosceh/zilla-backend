FROM liquibase/liquibase:4.25-alpine

COPY ./schema /liquibase/changelog