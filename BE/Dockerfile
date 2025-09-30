# Dockerfile
FROM node:18-alpine

WORKDIR /app

# copy package files first to leverage docker cache
COPY package*.json ./
RUN npm ci --production

# copy app source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# use npm start - ensure package.json has "start" script
CMD ["npm", "start"]
