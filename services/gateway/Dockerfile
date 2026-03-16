FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY services/gateway/package.json ./services/gateway/
COPY services/gateway/tsconfig.json ./services/gateway/

RUN npm install

COPY services/gateway/src ./services/gateway/src

RUN npm run build -w gateway

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/services/gateway/package.json ./services/gateway/
COPY --from=builder /app/services/gateway/dist ./services/gateway/dist

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start", "-w", "gateway"]
