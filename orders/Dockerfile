FROM node:alpine AS common-build
WORKDIR /build/common
COPY common/package.json ./
RUN npm install
COPY common/tsconfig.json ./
COPY common/src ./src
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=common-build /build/common ./common

WORKDIR /app/orders
COPY orders/package.json ./
RUN npm install
COPY orders/ ./

CMD ["npm", "run", "dev"]
