# Production image: built once with `next build`, served with `next start`
FROM node:24-alpine AS build

WORKDIR /app

# next.config `env` values are baked in at build time
ARG SITE_URL=https://solarlc.com
ARG WHATSAPP_NUMBER=916392554283
ARG GA_ID=
ENV SITE_URL=$SITE_URL WHATSAPP_NUMBER=$WHATSAPP_NUMBER GA_ID=$GA_ID NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.mjs ./
# Seed install photos/videos are in public/uploads; the uploads volume starts with them
COPY --from=build --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["npm", "start"]
