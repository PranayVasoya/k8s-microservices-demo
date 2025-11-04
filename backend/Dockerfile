FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### 1️⃣5️⃣ **backend/.dockerignore**
```
node_modules
.git
.gitignore
README.md