FROM node:9-alpine

RUN apk add --update python make

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

ENV NODE_ENV production

RUN yarn build

CMD yarn start
