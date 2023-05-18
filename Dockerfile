FROM node:19

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile --no-cache --production=false

COPY . .

RUN yarn build

EXPOSE 5000

CMD ["yarn", "run", "dev"]

