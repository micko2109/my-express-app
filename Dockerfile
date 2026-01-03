
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

FROM node:18-alpine AS production

WORKDIR /usr/src/app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
    
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/server.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./

RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

