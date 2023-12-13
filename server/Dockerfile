# syntax=docker/dockerfile:1.4

FROM node:18-bullseye-slim AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends ftp

LABEL AUTHOR="SPINNAFRE"

LABEL PROJECT_NAME="Background jobs with Pg-boss and Node.js"

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY ["./src","/usr/src/app/src/"]
COPY [".env","/usr/src/app/"]


EXPOSE 3333
# HEALTHCHECK --interval=30s \
#     CMD node healthcheck.js

ENTRYPOINT node ./src/server.js

