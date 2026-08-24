FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4200

COPY --from=build /app/dist/front ./dist/front

EXPOSE 4200
CMD ["node", "dist/front/server/server.mjs"]
