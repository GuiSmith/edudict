CREATE TABLE IF NOT EXISTS chat_mensagem (
    id SERIAL PRIMARY KEY,
    id_chat INT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tokens_prompt INT NULL,
    tokens_completion INT NULL,
    data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
