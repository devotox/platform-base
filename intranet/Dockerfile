# Base Image to use
FROM devotox/node

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Environment production
ENV NODE_ENV "production"

# Provides cached layer for node_modules
COPY package.json /tmp/intranet/package.json
RUN cd /tmp/intranet && npm install --unsafe-perm --no-optional --no-progress --dev

RUN mkdir -p /var/app/current/intranet && \
	ln -s /tmp/intranet/package.json /var/app/current/intranet/package.json && \
	ln -s /tmp/intranet/node_modules /var/app/current/intranet/node_modules

# Provides cached layer for bower_components
COPY bower.json /tmp/intranet/bower.json
RUN cd /tmp/intranet && bower install --allow-root

RUN mkdir -p /var/app/current/intranet && \
	ln -s /tmp/intranet/bower.json /var/app/current/intranet/bower.json && \
	ln -s /tmp/intranet/bower_components /var/app/current/intranet/bower_components

# Define working directory
COPY . /var/app/current/intranet
WORKDIR /var/app/current/intranet

# Define working directory as a volume
VOLUME ["/var/app/current/intranet", "/tmp/intranet", "/var/log/intranet"]

# Expose port for live reload
EXPOSE 9000 39000

# Build application
# RUN ember build

# Run app
CMD ["bash", "-c", "ember", "serve"]
