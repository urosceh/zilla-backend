FROM postgres:14-alpine

COPY ./config/database/init.sql /docker-entrypoint-initdb.d/