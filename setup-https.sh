#!/bin/bash

echo "🔒 Настройка HTTPS для survey-assessment..."

# Обновляем систему
echo "📦 Обновляем систему..."
apt update && apt upgrade -y

# Устанавливаем Nginx
echo "🌐 Устанавливаем Nginx..."
apt install -y nginx

# Устанавливаем Certbot для Let's Encrypt
echo "🔐 Устанавливаем Certbot..."
apt install -y certbot python3-certbot-nginx

# Останавливаем Nginx для настройки
echo "⏹️ Останавливаем Nginx..."
systemctl stop nginx

# Копируем конфигурацию
echo "📝 Копируем конфигурацию Nginx..."
cp nginx.conf /etc/nginx/sites-available/survey-assessment
ln -sf /etc/nginx/sites-available/survey-assessment /etc/nginx/sites-enabled/

# Удаляем дефолтную конфигурацию
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
echo "✅ Проверяем конфигурацию Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация Nginx корректна"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

# Запускаем Nginx
echo "🚀 Запускаем Nginx..."
systemctl start nginx
systemctl enable nginx

# Открываем порты в firewall
echo "🔥 Настраиваем firewall..."
ufw allow 80
ufw allow 443
ufw allow 22
ufw --force enable

# Генерируем SSL сертификат
echo "🔐 Генерируем SSL сертификат..."
certbot --nginx -d evaly.ru -d www.evaly.ru --non-interactive --agree-tos --email admin@example.com

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат успешно создан!"
    
    # Настраиваем автообновление сертификата
    echo "🔄 Настраиваем автообновление сертификата..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    # Перезапускаем Nginx
    systemctl reload nginx
    
    echo "🎉 HTTPS успешно настроен!"
    echo "🌐 Ваше приложение теперь доступно по адресу: https://evaly.ru"
    echo "🔒 Все соединения защищены SSL/TLS"
else
    echo "❌ Ошибка при создании SSL сертификата"
    echo "💡 Возможно, нужно настроить DNS или домен"
fi
