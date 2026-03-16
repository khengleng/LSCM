FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY services/portal/package.json ./services/portal/

RUN npm install

COPY services/portal ./services/portal

RUN npm run build -w portal

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/services/portal/package.json ./services/portal/
COPY --from=builder /app/services/portal/.next ./services/portal/.next
COPY --from=builder /app/services/portal/public ./services/portal/public
COPY --from=builder /app/services/portal/next.config.mjs ./services/portal/next.config.mjs

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start", "-w", "portal"]
