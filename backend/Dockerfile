FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar proyecto
COPY . .

# Exponer puerto
EXPOSE 3001

# Variables por defecto
ENV NODE_ENV=production

# Ejecutar aplicación
CMD ["npm", "start"]