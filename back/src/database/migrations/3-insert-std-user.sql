INSERT INTO usuario (nome, cpf, email, senha, ativo)
VALUES ('Administrador', '12345678909', 'admin@admin.com', '$2b$10$RMO8J9yvBZ187mmGHqZSieP5Cs9uo3DkPITBp7hZZj..TIqXmywbq', TRUE)
ON CONFLICT DO NOTHING;
