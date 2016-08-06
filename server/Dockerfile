# Base Image to use
FROM devotox/node

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Environment production
ENV NODE_ENV "production"

# Provides cached layer for node_modules
COPY package.json /tmp/api/package.json
RUN cd /tmp/api && npm install --unsafe-perm --no-optional --no-progress --dev

RUN mkdir -p /var/app/current/api && \
ln -s /tmp/api/package.json /var/app/current/api/package.json && \
ln -s /tmp/api/node_modules /var/app/current/api/node_modules

# Define working directory
COPY . /var/app/current/api
WORKDIR /var/app/current/api

# Define working directory as a volume
VOLUME ["/var/app/current/api", "/tmp/api", "/var/log/api"]

# Expose port
EXPOSE 3000 9999

# Run app
CMD ["bash", "-c", "gulp", "serve"]
