FROM node:latest

WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm ci

COPY package.json ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json

CMD npm start
