FROM node:16.18.1-alpine

# create destination directory
WORKDIR /usr/src/nuxt-app

# update and install dependencies
RUN apk update && apk upgrade
RUN apk add git

# install dependencies
COPY package*.json ./
RUN npm install

# expose port 5000
EXPOSE 5000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000

# start the app
CMD [ "npm", "start" ]
