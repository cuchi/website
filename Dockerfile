FROM node:12-alpine

RUN apk add --update python make

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn
COPY . ./

RUN yarn build
CMD yarn start
