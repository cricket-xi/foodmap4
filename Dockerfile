FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# If using a custom server like Express
# COPY --from=builder /app/server.ts ./
# RUN npm install -g tsx

EXPOSE 3000

# For Vite preview server (if SPA)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

# If using custom server
# CMD ["tsx", "server.ts"]
