FROM node:18-alpine
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
ENV NODE_ENV=production

# generate self-signed certificate to enable https. Only for server running locally
RUN openssl req -x509 -newkey rsa:4096 -keyout /tmp/key.pem -out /tmp/cert.pem -days 365 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN cp /tmp/key.pem /app/server/certs/key.pem
RUN cp /tmp/cert.pem /app/server/certs/cert.pem

EXPOSE 8080

CMD [ "node", "server/index.js" ]
