FROM node:14.15.0

WORKDIR /code

COPY package*.json /code/
RUN npm install

COPY . /code/

EXPOSE 3000

CMD [ "npm", "start" ]
