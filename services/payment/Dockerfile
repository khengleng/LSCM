FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY services/payment/package.json ./services/payment/
COPY services/payment/tsconfig.json ./services/payment/

RUN npm install

COPY services/payment/src ./services/payment/src

RUN npm run build -w payment

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/services/payment/package.json ./services/payment/
COPY --from=builder /app/services/payment/dist ./services/payment/dist

RUN npm install --omit=dev

EXPOSE 3001

CMD ["npm", "start", "-w", "payment"]
