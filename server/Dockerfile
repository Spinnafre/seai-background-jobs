# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim  AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends git

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

ADD . .

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT
# HEALTHCHECK --interval=30s \
#     CMD node healthcheck.js

CMD [ "node","/usr/src/app/src/server.js" ]  

