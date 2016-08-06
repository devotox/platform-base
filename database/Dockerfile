# Set postgres base image
FROM devotox/postgres

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Set work directory
WORKDIR /var/app/current/database
COPY . /var/app/current/database

# Set up SSL
COPY sslcert/ /var/ssl/

# Initialize database
COPY build.sql /docker-entrypoint-initdb.d/

# Set appropriate permissions and ownership
RUN chown -R postgres /var/ssl/server.key
RUN chmod -R 0600 /var/ssl/server.key

# Expose port
EXPOSE 5432
