# Set nginx base image
FROM devotox/nginx

# File Author / Maintainer
MAINTAINER Devonte Emokpae

# Copy over nginx directory
COPY . /etc/nginx

# Set Work Directory
WORKDIR /etc/nginx

# Link Third Party modules directory
RUN mkdir -p modules && ln -sf modules /usr/lib/nginx/modules

# Default command
CMD ["nginx-amplify-launch"]
# CMD ["nginx-watch"]
