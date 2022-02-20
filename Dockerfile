FROM node:16-alpine
RUN apk add python3 make gcc g++ dumb-init git

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN npm run build

CMD ["dumb-init", "npm", "start"]
