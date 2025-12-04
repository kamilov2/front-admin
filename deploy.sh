#!/bin/bash

# Build and start Docker container
echo "🚀 Building and starting megamozg-admin..."

# Build image
docker-compose build --no-cache

# Start container
docker-compose up -d

# Show logs
echo "📋 Container logs:"
docker-compose logs -f
