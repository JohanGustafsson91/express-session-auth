FROM node:14.15.0

WORKDIR /backend

COPY package*.json /backend/
RUN npm install

COPY . /backend/

EXPOSE 8080

CMD ["npm", "run", "dev"]