FROM node:23.11.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000 9229

RUN npx prisma generate

CMD ["npm", "run", "start:debug"]