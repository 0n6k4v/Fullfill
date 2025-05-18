FROM postgis/postgis:16-3.4

RUN echo "CREATE EXTENSION IF NOT EXISTS postgis;" > /docker-entrypoint-initdb.d/00_create_extension.sql

COPY database/init.sql /docker-entrypoint-initdb.d/01_init.sql
