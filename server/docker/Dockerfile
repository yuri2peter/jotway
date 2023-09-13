FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./dist ./dist
COPY ./html/frontend ./html/frontend
# EXPOSE 3000
CMD ["node", "./dist/main.js"]
