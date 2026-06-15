## AuthContext

- Arquivo: `front/src/contexts/AuthContext.js`
- Provider registrado em `front/src/pages/_app.js`
- Ao iniciar a aplicação, deve chamar `GET /auth/me`
- `GET /auth/me`:
  - `200`: usuário autenticado, retorna diretamente o JSON do usuário sem senha
  - `401`: usuário não autenticado
- Estados:
  - `isAuthLoading`
  - `isAuthenticated`
  - `user`
- Funções:
  - `login`: após login bem-sucedido, chama `/auth/me` e atualiza o estado
  - `logout`: chama `/auth/logout`, limpa estado local e redireciona para `/login`
- Em caso de logout com erro/401, também deve limpar estado local

## authAxios

- Arquivo: `front/src/utils/authAxios.js`
- Deve centralizar chamadas autenticadas ao back-end
- Deve usar `withCredentials: true`
- Em erro `401`, deve redirecionar para `/login`, exceto se já estiver na tela de login
- Deve evitar espalhar `credentials/include` ou `withCredentials` pela aplicação

## Proteção de rotas

- Rotas públicas:
  - `/`
  - `/docs/api`
  - wiki
- Rotas guest-only:
  - `/login`
- Todas as demais rotas são privadas
- Usuário não autenticado em rota privada: redireciona para `/login`
- Usuário autenticado em `/login`: redireciona para a rota principal do sistema