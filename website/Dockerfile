# Base Image to use
FROM devotox/node

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Environment production
ENV NODE_ENV "production"

# Provides cached layer for node_modules
COPY package.json /tmp/website/package.json
RUN cd /tmp/website && npm install --unsafe-perm --no-optional --no-progress --dev

RUN mkdir -p /var/app/current/website && \
	ln -s /tmp/website/package.json /var/app/current/website/package.json && \
	ln -s /tmp/website/node_modules /var/app/current/website/node_modules

# Provides cached layer for bower_components
COPY bower.json /tmp/website/bower.json
RUN cd /tmp/website && bower install --allow-root

RUN mkdir -p /var/app/current/website && \
	ln -s /tmp/website/bower.json /var/app/current/website/bower.json && \
	ln -s /tmp/website/bower_components /var/app/current/website/bower_components

# Define working directory
COPY . /var/app/current/website
WORKDIR /var/app/current/website

# Define working directory as a volume
VOLUME ["/var/app/current/website", "/tmp/website", "/var/log/website"]

# Expose port for live reload
EXPOSE 9000 39000

# Build application
# RUN ember build

# Run app
CMD ["bash", "-c", "ember", "serve"]
