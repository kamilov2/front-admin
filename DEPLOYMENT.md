# 🚀 CI/CD Deployment Guide

## Автоматический деплой

Приложение автоматически деплоится при пуше в ветку `main`.

### Требования для сервера

1. **Docker** и **Docker Compose** установлены
2. **SSH доступ** к серверу
3. **GitHub Secrets** настроены:
   - `SERVER_HOST` - IP адрес сервера
   - `SERVER_USER` - пользователь SSH (обычно `root`)
   - `SSH_PRIVATE_KEY` - приватный SSH ключ
   - `SERVER_PORT` - порт SSH (по умолчанию 22)

## Настройка GitHub Secrets

1. Перейдите: `Settings` → `Secrets and variables` → `Actions`
2. Добавьте secrets:
   ```
   SERVER_HOST: your-server-ip
   SERVER_USER: root
   SSH_PRIVATE_KEY: ваш-приватный-ключ
   SERVER_PORT: 22
   ```

## Локальный запуск с Docker

### Быстрый старт
```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Альтернативный запуск
```bash
# Используйте готовые скрипты
chmod +x deploy.sh stop.sh
./deploy.sh
```

## Ручной деплой на сервер

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/kamilov2/front-admin.git
cd front-admin

# 2. Запустите Docker Compose
docker-compose up -d --build

# 3. Проверьте статус
docker ps | grep megamozg-admin
```

## Проверка работы

После деплоя приложение доступно на:
- **Локально**: http://localhost:3010
- **На сервере**: http://your-server-ip:3010

## Команды управления

```bash
# Посмотреть логи
docker logs megamozg-admin -f

# Перезапустить контейнер
docker restart megamozg-admin

# Остановить
docker stop megamozg-admin

# Удалить контейнер
docker rm megamozg-admin

# Обновить до последней версии
git pull
docker-compose up -d --build
```

## Структура CI/CD

```
.github/workflows/deploy.yml - GitHub Actions workflow
Dockerfile                   - Multi-stage production build
docker-compose.yml          - Docker Compose конфигурация
.dockerignore               - Исключения для Docker
deploy.sh                   - Скрипт быстрого деплоя
stop.sh                     - Скрипт остановки
```

## Мониторинг

```bash
# Статус контейнера
docker ps

# Использование ресурсов
docker stats megamozg-admin

# Health check
curl http://localhost:3010
```

## Troubleshooting

### Порт уже занят
```bash
# Найти процесс на порту 3010
lsof -i :3010
# или
netstat -tulpn | grep 3010

# Остановить старый контейнер
docker stop megamozg-admin
```

### Ошибка сборки
```bash
# Очистить кеш Docker
docker builder prune -af

# Пересобрать без кеша
docker-compose build --no-cache
```

### Проблемы с памятью
```bash
# Очистить неиспользуемые образы
docker image prune -af

# Очистить всё
docker system prune -af --volumes
```

## Production Best Practices

✅ Multi-stage build для минимального размера образа  
✅ Non-root пользователь для безопасности  
✅ Health checks для мониторинга  
✅ Автоматический рестарт при сбоях  
✅ Логирование в stdout/stderr  
✅ Оптимизация кеша сборки  

## Масштабирование

Для запуска нескольких инстансов:

```bash
docker-compose up -d --scale megamozg-admin=3
```

Используйте nginx как reverse proxy для балансировки нагрузки.
