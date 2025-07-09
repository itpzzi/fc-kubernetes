FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Instala dependências e compila
RUN npm install && npm run build

# Expõe a porta e define o comando
EXPOSE 3000
CMD ["node", "dist/index.js"]
