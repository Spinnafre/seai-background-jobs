# syntax=docker/dockerfile:1.4

FROM node:18 AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends git && apt-get install ftp

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY ["./src","/usr/src/app/src/"]
COPY ["./bin","/usr/src/app/bin/"]
COPY [".env","/usr/src/app/"]


# HEALTHCHECK --interval=30s \
#     CMD node healthcheck.js

ENTRYPOINT node ./bin/workers.js

