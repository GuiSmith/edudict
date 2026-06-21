CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    id_usuario INT NULL REFERENCES usuario(id),
    guest_session_id UUID NULL,
    id_predicao INT NULL REFERENCES predicao(id),
    titulo VARCHAR(200) NULL,
    data_hora_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_hora_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_usuario IS NOT NULL AND guest_session_id IS NULL)
        OR
        (id_usuario IS NULL AND guest_session_id IS NOT NULL)
    )
);
