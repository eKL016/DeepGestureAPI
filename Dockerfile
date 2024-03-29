FROM keymetrics/pm2:latest-alpine

# Bundle APP files

COPY src src/
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV AWS_REGION us-east-2
ENV TZ Asia/Taipei

RUN npm install --production

CMD [ "pm2-runtime", "start", "pm2.json" ]
