FROM postgis/postgis:17-master

# Create initialization script that creates PostGIS extension first
RUN echo "CREATE EXTENSION IF NOT EXISTS postgis;" > /docker-entrypoint-initdb.d/00_create_extension.sql

# Copy initialization script
COPY database/init.sql /docker-entrypoint-initdb.d/01_init.sql