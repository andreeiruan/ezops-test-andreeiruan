FROM node:12-alpine

WORKDIR /home/node/app

COPY . .

RUN yarn

EXPOSE ${SERVER_PORT}
CMD ["yarn", "start"]