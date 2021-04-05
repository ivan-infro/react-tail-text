FROM node:latest AS builder

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install && npm install -g parcel

COPY . ./
RUN NODE_ENV=production npm run build:js

WORKDIR ./example
RUN NODE_ENV=production parcel build ./src/index.html

FROM nginx
COPY --from=builder /usr/src/app/example/dist /usr/share/nginx/html
