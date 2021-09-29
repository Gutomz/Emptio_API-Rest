FROM node:alpine

WORKDIR /usr/api

COPY package.json .

RUN npm install
RUN npm install typescript -g

COPY . .

RUN tsc

CMD ["node", "./dist/server.js"]
