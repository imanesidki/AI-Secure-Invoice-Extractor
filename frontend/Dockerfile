FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --force --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]