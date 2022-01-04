FROM node:14.16.0-alpine3.10

WORKDIR /usr/src/smart-brain-api-typescript

COPY ./ ./

RUN npm install

RUN npm install -g typescript

CMD ["/bin/bash"]