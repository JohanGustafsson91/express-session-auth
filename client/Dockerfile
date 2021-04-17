FROM node:14.15.0

WORKDIR /client

COPY package*.json /client/
RUN npm install

COPY . /client/

EXPOSE 3000

CMD [ "npm", "start" ]
