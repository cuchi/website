FROM node:14.17.1

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn
COPY . ./

RUN yarn build
CMD yarn start
