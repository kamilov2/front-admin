# 🚀 Быстрый старт

## Локальный запуск с Docker

```bash
# 1. Сборка и запуск
docker-compose up -d --build

# 2. Проверка
docker ps
curl http://localhost:3010

# 3. Логи
docker-compose logs -f

# 4. Остановка
docker-compose down
```

## Деплой на сервер

### 1. Настройте GitHub Secrets

В репозитории `Settings` → `Secrets and variables` → `Actions`:

```
SERVER_HOST = IP вашего сервера
SERVER_USER = root
SSH_PRIVATE_KEY = ваш приватный SSH ключ
SERVER_PORT = 22
```

### 2. Push в main

```bash
git push origin main
```

GitHub Actions автоматически:
- ✅ Соберёт Docker образ
- ✅ Загрузит в GitHub Container Registry
- ✅ Деплоит на сервер
- ✅ Запустит на порту 3010

## Команды

```bash
# С помощью npm
npm run docker:build   # Собрать образ
npm run docker:up      # Запустить
npm run docker:down    # Остановить
npm run docker:logs    # Логи
npm run deploy         # Быстрый деплой

# С помощью make
make build    # Собрать
make deploy   # Деплой
make logs     # Логи
make clean    # Очистка
```

## Проверка работы

- Локально: http://localhost:3010
- Сервер: http://your-server-ip:3010

---

📖 Подробная документация: [DEPLOYMENT.md](DEPLOYMENT.md)
