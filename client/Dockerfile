# Utilisez une image de node comme base
FROM node:20.11.1

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Clear the npm cache
RUN npm cache clean --force

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port 5173 pour le serveur web
EXPOSE 5173

# Démarrez le serveur web
CMD ["npm", "start"]