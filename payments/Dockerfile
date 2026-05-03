# Build from services root (same context as Skaffold):
#   docker build -f payments/Dockerfile -t ehtesham-dev/payments .
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

WORKDIR /app/payments
COPY payments/package.json ./
RUN npm install
COPY payments/ ./

EXPOSE 3000
CMD ["npm", "run", "dev"]
