# 1. Aşama: Temel imajı seçin (Örn: Node.js)
FROM node:20-alpine

# 2. Çalışma dizinini ayarlayın
WORKDIR /app

# 3. Bağımlılıkları kopyalayın ve yükleyin (Eğer varsa)
# COPY package*.json ./
# RUN npm install

# 4. Uygulama kodunu kopyalayın (HTML, CSS, JS dosyalarınız)
COPY . .

# 5. Uygulamanın çalışacağı portu belirtin (Sadece bilgilendirme)
# Haber siteniz sadece HTML/CSS/JS ise bu aşama isteğe bağlıdır.
# Eğer Express gibi bir sunucu kullanıyorsanız gereklidir.
# EXPOSE 8080 

# 6. Uygulamayı başlatma komutu
# CMD ["node", "server.js"] 
# VEYA, basit HTML/CSS/JS için bir hafif web sunucusu (Örn: Nginx) kullanabilirsiniz:
# FROM nginx:alpine
# COPY . /usr/share/nginx/html
