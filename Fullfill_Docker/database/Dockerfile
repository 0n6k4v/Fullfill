FROM postgis/postgis:17-master

# Create the extension
RUN echo "CREATE EXTENSION IF NOT EXISTS postgis;" > /docker-entrypoint-initdb.d/init.sql

# Copy initialization script
COPY database/init.sql /docker-entrypoint-initdb.d/init.sql