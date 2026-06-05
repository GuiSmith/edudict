CREATE TABLE IF NOT EXISTS log_api (
    id BIGSERIAL PRIMARY KEY,
    data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo VARCHAR(10) NOT NULL,
    rota TEXT NOT NULL,
    url_original TEXT,
    status_code SMALLINT NOT NULL,
    ip INET,
    user_agent TEXT,
    referer TEXT,
    params JSONB,
    query JSONB,
    body JSONB,
    response_body JSONB,
    response_time_ms INTEGER NOT NULL,
    id_usuario INTEGER REFERENCES usuario(id),
    erro BOOLEAN NOT NULL DEFAULT FALSE,
    erro_mensagem TEXT
);
