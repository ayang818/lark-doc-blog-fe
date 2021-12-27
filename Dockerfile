FROM node:14-buster-slim
WORKDIR /lark-doc-blog/fe

COPY package.json ./
RUN npm --registry https://registry.npm.taobao.org  install

COPY . .
RUN npm run build
RUN npm --registry https://registry.npm.taobao.org  install -g serve

CMD ["serve", "-s", "build"]
