Crie um `ThemeContext` para o front-end Next.js usando Material UI de forma idiomática, aproveitando corretamente o design pattern de tema oferecido pelo MUI.

Objetivo:
Implementar suporte a tema claro/escuro centralizado, reutilizável e consistente em toda a aplicação.

Requisitos:

1. Criar um contexto de tema em:
   `front/src/contexts/ThemeContext.jsx`

2. O contexto deve expor:
   - `mode`: valor atual do tema, podendo ser `"light"` ou `"dark"`;
   - `toggleTheme`: função para alternar entre claro e escuro;
   - `setThemeMode`: função para definir explicitamente `"light"` ou `"dark"`.

3. Usar os recursos oficiais do MUI:
   - `createTheme`;
   - `ThemeProvider` do `@mui/material/styles`;
   - `CssBaseline`;
   - `palette.mode`.

4. O tema deve ser criado com `useMemo`, evitando recriação desnecessária em todo render.

5. Persistir a preferência do usuário no `localStorage`.

6. Ao carregar a aplicação:
   - se houver tema salvo no `localStorage`, usar ele;
   - se não houver, usar preferência do sistema via `prefers-color-scheme`;
   - se não for possível detectar, usar `"light"` como fallback.

7. Evitar erro de SSR/hydration:
   - não acessar `window` ou `localStorage` diretamente fora de `useEffect` ou de checagens seguras;
   - garantir que o tema inicial não quebre no Next.js.

8. Integrar o provider no layout global da aplicação:
   - se o projeto usar `pages/`, integrar em `front/src/pages/_app.js`;
   - se usar `app/`, integrar no provider raiz adequado.

9. Não espalhar lógica de tema pelas páginas.
   Componentes devem consumir o tema via:
   - `useTheme`;
   - `sx`;
   - tokens da `palette`;
   - ou o hook/contexto criado apenas quando precisarem alternar o tema.

10. Criar um hook:
   `useThemeContext()`
   que lance erro claro caso seja usado fora do provider.

11. O código deve ser simples, limpo e extensível.
    Não criar abstrações desnecessárias.
    Não criar múltiplos `useState` inúteis.
    Não usar cores hardcoded nas páginas quando puder usar tokens do MUI.

12. Caso exista tema ou provider atual no projeto, refatore preservando compatibilidade e removendo duplicações.

Resultado esperado:
- `ThemeContext.jsx` funcional;
- provider aplicado globalmente;
- aplicação inteira respondendo ao tema claro/escuro;
- preferência persistida;
- uso correto do padrão de tema do Material UI.

Ao estilizar componentes, priorize `theme.palette`, `theme.spacing`, `theme.typography`, `theme.shape` e `sx` em vez de CSS solto ou valores hardcoded.