FROM node:14.15.0

WORKDIR /code

COPY package*.json /code/

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
