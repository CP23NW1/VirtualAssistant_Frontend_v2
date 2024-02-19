FROM node:14

WORKDIR /app

COPY . .

WORKDIR /app/Samples/TypeScript/Demo

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]
