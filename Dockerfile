
FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN yarn check --integrity || yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]

