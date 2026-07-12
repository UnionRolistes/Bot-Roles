FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --ignore-scripts

COPY . .

CMD ["node", "Start_Bot_Roles.js"]
