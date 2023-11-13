FROM node:lts-alpine3.18
ENV NODE_ENV=production
WORKDIR /app
LABEL version="v1.3.0" description="Jotway" project="https://github.com/yuri2peter/jotway" maintainer="yuri2peter@github"
COPY ./app /app
CMD ["node", "./dist/main.js"]
