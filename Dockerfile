FROM nikolaik/python-nodejs:latest AS ui-build

WORKDIR /usr/app/
COPY client/package*.json ./
RUN npm install

COPY client ./
WORKDIR /usr/app/client
RUN npm run build

FROM nikolaik/python-nodejs:latest AS server-build

WORKDIR /usr/app/

COPY --from=ui-build /usr/app/build ./client/build/
WORKDIR /usr/app/server

COPY server/package*.json ./
RUN npm install

COPY server ./

RUN pip install netmiko==3.4.0

ENV NODE_ENV=production

EXPOSE 5005

CMD ["node", "server.js"]
