# Build with this directory as context:
#   cd payments && docker build -t ehtesham-dev/payments .
FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
