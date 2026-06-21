# Desenvolvimento
dev-down:
	cd infra && docker compose -p edudict-dev -f docker-compose.dev.yml down
dev-up:
	cd infra && docker compose -p edudict-dev -f docker-compose.dev.yml up -d
dev-migrate:
	cd infra && docker exec -it edudict-dev-back npm run db:sync
dev-psql:
	docker exec -it edudict-dev-db psql -U edudict -d edudict
# Produção
down:
	cd infra && docker compose -p edudict -f docker-compose.yml down
up:
	cd infra && docker compose -p edudict -f docker-compose.yml up -d --build
migrate:
	cd infra && docker exec -it edudict-back npm run db:sync
psql:
	docker exec -it edudict-back psql -U edudict -d edudict
