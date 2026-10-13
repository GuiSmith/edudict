#!/bin/bash
set -euao pipefail
source infra/.env
set +a

BKP_DIR="${1:?Missing BKP_DIR as an argument}"

docker exec edudict-db pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BKP_DIR/bkp.sql"
