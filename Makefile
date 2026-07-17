# Desenvolvimento
dev-down:
	cd infra && \
	docker compose -f docker-compose.dev.yml down
dev-up:
	cd infra && \
	docker compose -f docker-compose.dev.yml up -d
dev-migrate:
	cd infra && \
	docker exec -it edudict-dev-back npm run db:sync
dev-psql:
	docker exec -it edudict-dev-db psql -U edudict -d edudict

# Produção
down:
	cd infra && \
	docker compose -f docker-compose.yml down
build: 
	docker build -t guismith/edudict-front:latest ./front/ && \
	docker build -t guismith/edudict-back:latest ./back/
push:
	docker push guismith/edudict-front:latest && \
	docker push guismith/edudict-back:latest
up:
	cd infra && \
	docker compose pull && \
	docker compose -f docker-compose.yml up -d
migrate:
	cd infra && \
	docker exec -it edudict-back npm run db:sync
psql:
	docker exec -it edudict-back psql -U edudict -d edudict
