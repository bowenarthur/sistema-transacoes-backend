FROM node:latest

RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend
COPY package.json /usr/src/backend/
RUN npm install
RUN npm install typescript -g
COPY . /usr/src/backend
RUN npx prisma generate
RUN tsc
EXPOSE 8000
CMD ["npm", "run", "start"]