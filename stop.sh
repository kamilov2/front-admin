#!/bin/bash

echo "🛑 Stopping megamozg-admin..."
docker-compose down

echo "🧹 Cleaning up..."
docker system prune -f

echo "✅ Stopped and cleaned up!"
