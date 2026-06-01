import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import chalk from "chalk";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(currentDir, "migrations");
const envPath = resolve(currentDir, "../../../.env");

config({ path: envPath });

const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Variaveis de ambiente obrigatorias ausentes: ${missingEnvVars.join(", ")}`
  );
}

const databaseUrl = `postgresql://${encodeURIComponent(
  process.env.DB_USER
)}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${
  process.env.DB_PORT
}/${process.env.DB_NAME}`;

const db = new PrismaClient({
  datasourceUrl: databaseUrl,
});

const ensureMigrationsTable = async () => {
  await db.$executeRaw`
    CREATE TABLE IF NOT EXISTS migrations (
      nome_arquivo VARCHAR(200) PRIMARY KEY,
      executada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
};

const getMigrationFiles = async () => {
  const files = await readdir(migrationsDir);

  return files
    .filter((fileName) => fileName.toLowerCase().endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const hasMigrationRun = async (fileName) => {
  const rows = await db.$queryRaw`
    SELECT 1
    FROM migrations
    WHERE nome_arquivo = ${fileName}
    LIMIT 1
  `;

  return rows.length > 0;
};

const runMigration = async (fileName) => {
  const migrationPath = resolve(migrationsDir, fileName);
  const sql = await readFile(migrationPath, "utf8");

  await db.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(sql);
    await tx.$executeRaw`
      INSERT INTO migrations (nome_arquivo)
      VALUES (${fileName})
    `;
  });
};

const run = async () => {
  try {
    await ensureMigrationsTable();

    const files = await getMigrationFiles();

    for (const fileName of files) {
      if (await hasMigrationRun(fileName)) {
        console.log(`${chalk.yellow("[SKIP]")} ${fileName}`);
        continue;
      }

      console.log(`${chalk.blue("[EXECUTING]")} ${fileName}`);
      await runMigration(fileName);
    }

    console.log(chalk.green("Migrações finalizadas"));
  } catch (error) {
    console.error(chalk.red("Erro ao executar migrações:"), error);
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
};

run();
