CREATE TABLE IF NOT EXISTS log_app (
    id BIGSERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id),
    data_hora TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
    tabela VARCHAR(100) NOT NULL,
    id_tabela BIGINT,
    operacao VARCHAR(10) NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
    antes JSONB,
    depois JSONB
);
