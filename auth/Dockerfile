FROM node:alpine

WORKDIR /app
RUN apk add --no-cache tar
COPY package.json .
# RUN npm install --omit=dev
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]