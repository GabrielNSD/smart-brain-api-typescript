FROM node:17

WORKDIR /usr/src/smart-brain-api-typescript

COPY ./ ./

CMD ["/bin/basj"]