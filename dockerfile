# Dockerfile

# 1. Aşama: Temel imajı belirle
# Nginx'in alpine sürümü, son derece küçük (yaklaşık 20MB) ve hızlı bir web sunucusudur.
FROM nginx:alpine

# 2. Çalışma Dizini
# Nginx'in varsayılan web kök dizini: /usr/share/nginx/html
# Tüm statik dosyalarımızı buraya kopyalayacağız.
WORKDIR /usr/share/nginx/html

# 3. Dosyaları Kopyala
# GitHub deponuzdaki (veya yerel klasörünüzdeki) tüm dosyaları
# konteyner içindeki Nginx'in servis edeceği dizine kopyalayın.
# Bu, index.html, style.css ve script.js'i içerir.
COPY . /usr/share/nginx/html

# 4. Portu Açığa Çıkar
# Nginx varsayılan olarak 80 portunda çalışır.
# Bu komut, Docker'a bu portun kullanılacağını bildirir.
EXPOSE 80

# 5. Konteyneri Başlatma
# Nginx'in ön planda çalışmasını sağlayarak Docker'ın konteyneri canlı tutmasını sağlar.
# Bu komut, temel imajda zaten tanımlı olduğu için bu basit örnekte opsiyoneldir,
# ancak netlik için eklenmiştir.
CMD ["nginx", "-g", "daemon off;"]
