FROM node AS base

WORKDIR /app

COPY package*.json ./

###############################################################################
# Development image (for local/dev use with hot reload)
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

###############################################################################
# Production image (small, only runtime deps)
FROM base AS production

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
