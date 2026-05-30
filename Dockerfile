FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Meng-copy seluruh kode sumber, termasuk file .env rahasia
COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]