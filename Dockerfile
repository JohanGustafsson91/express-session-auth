FROM node:14.15.0 as base

WORKDIR /code

COPY package*.json /code/
RUN npm install

COPY . /code/

EXPOSE 8080

CMD ["npm", "run", "dev"]



