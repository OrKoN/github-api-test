FROM node:7-slim

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production --loglevel=warn
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

ADD . /src
WORKDIR /src

EXPOSE 3000

CMD ["node", "index.js"]