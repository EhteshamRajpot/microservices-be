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

WORKDIR /app/tickets
COPY tickets/package.json tickets/.npmrc ./
RUN npm install
COPY tickets/ ./

CMD ["npm", "run", "dev"]
