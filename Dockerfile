FROM node:20.10-alpine3.19 AS base

RUN mkdir -p /home/node/zilla-backend && chown -R node:node /home/node/zilla-backend

WORKDIR /home/node/zilla-backend

COPY --chown=node:node package*.json ./

USER node
RUN npm ci

COPY --chown=node:node src/ /home/node/zilla-backend/src/
COPY --chown=node:node tsconfig.json /home/node/zilla-backend/

RUN npm run build

FROM node:20.10-alpine3.19

RUN mkdir -p /home/node/zilla-backend && chown -R node:node /home/node/zilla-backend

WORKDIR /home/node/zilla-backend

COPY --chown=node:node package*.json ./

USER node
RUN npm ci --production

COPY --from=base --chown=node:node /home/node/zilla-backend/build /home/node/zilla-backend/build

CMD ["node", "build/index.js"]