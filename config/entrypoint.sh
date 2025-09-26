#!/bin/sh
echo "🔧 Gerando config.json com API_URL=$API_URL"

envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json

echo "📄 Conteúdo final do config.json:"
cat /usr/share/nginx/html/assets/config.json

exec nginx -g 'daemon off;'
