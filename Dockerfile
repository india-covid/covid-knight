# base image
FROM node:14.17.0-alpine3.12 as build
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH


COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli


COPY . /app

RUN ng build --output-path=dist

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
LABEL com.centurylinklabs.watchtower.enable="true"
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
