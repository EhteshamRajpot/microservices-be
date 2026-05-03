# Build with this directory as context (typical):
#   cd expiration && docker build -t ehtesham-dev/expiration .
# From monorepo `services/` parent:
#   docker build -f expiration/Dockerfile -t ehtesham-dev/expiration ./expiration
FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
