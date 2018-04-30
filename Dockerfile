FROM node:9-alpine

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

ENV NODE_ENV production

RUN yarn build

CMD yarn start
