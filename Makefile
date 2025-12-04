.PHONY: help build up down restart logs clean deploy

help: ## Show this help
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image
	docker-compose build --no-cache

up: ## Start containers
	docker-compose up -d

down: ## Stop containers
	docker-compose down

restart: ## Restart containers
	docker-compose restart

logs: ## Show logs
	docker-compose logs -f

clean: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -af

deploy: ## Build and deploy
	docker-compose up -d --build
	@echo "✅ Deployed successfully on port 3010"

status: ## Show container status
	docker ps | grep megamozg-admin || echo "Container not running"

shell: ## Open shell in container
	docker exec -it megamozg-admin sh

stop: ## Stop and remove container
	docker stop megamozg-admin || true
	docker rm megamozg-admin || true
