# Use a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta que será usada pela aplicação
EXPOSE 3000

# Define a variável de ambiente para produção (ajustável conforme necessário)
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]
