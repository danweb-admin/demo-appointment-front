# ===== STAGE 1: Build Angular =====
FROM node:16.15.0 AS angular-build
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install --force

# Copia o restante do código e faz build
COPY . .
RUN npm run build --prod

# ===== STAGE 2: Nginx para servir a aplicação =====
FROM nginx:alpine

# Instala utilitário para substituir variáveis de ambiente (envsubst)
RUN apk add --no-cache bash curl gettext

# Configuração customizada do Nginx
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do Angular
COPY --from=angular-build /app/dist/agenda-view-front /usr/share/nginx/html

# Copia template de config (com variáveis)
COPY ./src/assets/config.template.json /usr/share/nginx/html/assets/config.template.json

# Copia entrypoint que gera config.json a partir das variáveis de ambiente
COPY ./config/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
