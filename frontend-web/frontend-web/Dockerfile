FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar proyecto
COPY . .

# Build de Next.js
RUN npm run build

# Exponer puerto
EXPOSE 3000

ENV NODE_ENV=production

# Iniciar Next.js
CMD ["npm", "start"]