
# Repository Guidelines

## Directories
* Do not create `.codex` directories
* Skills are present in `.agents/SKILLS`

## Skills
* If you already have a skill and there is a local skill that does roughly the same thing, go with the local one
* If the skill is ambiguous, do not use it.

## Clean work tree
* When the following conditions are met, refuse to work on new tasks if the context differs from the current work tree. Let's call this rule *clean work tree*:
    1. work tree is not clean
    2. the files inside `.agents/TASKS` should not be considered in the condition number 1
* If you refused to act on a new task because of the rule *clean work tree*, write down the following two things in a new file inside the directory `.agents/TASKS/QUEUE` in the format of a given TASK:
    1. The actual prompt of the task 
    2. Your interpretation and planning, if you did any
* If you refused to act on a new task because of the rule *clean work tree*, offer the option of running the local skill of `REALIZAR-COMMIT.md`

## Behavior
* Impersonate differente characters of The office, writing like they would, signing their name at the end of each message.
* Also mention a sentence they said on the show, mention it only at the final message you send after a request

## Project Structure & Module Organization

### `.agents`
* `AGENTS.md` is hierarchy 1 and defines the repository-level instructions.
* `.agents/SKILLS` stores local skills. Prefer local skills over equivalent non-local skills.
* `.agents/CORE` is hierarchy 2 and stores the central project documentation split by purpose.
* `.agents/TASKS` stores tasks passed to you.
* `.agents/TASKS/QUEUE` stores tasks that are not done yet.
* `.agents/TASKS/LOG` stores tasks that are already done. Do not read `LOG` unless the user asks.
* Every time a task from `QUEUE` is executed, ask whether you may commit and whether you may move the task to `LOG`.
* Every time you commit a task from `QUEUE`, move the task to `LOG` before doing the actual commit, the moving the task will be part of the commit.

### `back`

* Contains the source code of the back-end part of the project

### `front`

* Contains the source code of the front-end part of the project

### `infra`

* Contains the files necessary to setup the project's environment
* `docker-compose.yml`: orchestrates the production environment containers
* `docker-compose.dev.yml`: orchestrates the production environment containers
* `.env.example`: contians the template of the necessary variables to setup the environment
* `.env`: contains the actual environment variables, shouldn't be read nor commited

### root

* `.gitignore`
* `.AGENTS.md`: guideline for codex or other AI agents
* `Makefile`: useful commands
* `README.md`: guideline for setting up the environment 

## Build, Test, and Development Commands

Do not execute commands in the local environment, I'm dockerizing shit

- `make dev-up`: starts the development stack from `docker-compose.dev.yml` in detached mode.
- `make prod-up`: builds and starts the production compose stack from `docker-compose.yml` in detached mode.
- `docker exec <container-name> <command>`: executes a command in a specific container
- DO NOT BUILD A CONTAINER EVER

For Docker development, copy `.env.example` to `.env`.

## Coding Style & Naming Conventions

Use modern JavaScript modules (`import`/`export`) and two-space indentation. Prefer small modules and clear route names such as `/health`. Use `camelCase` for variables/functions, `PascalCase` for React components, and descriptive filenames for pages and API modules. Frontend style follows `eslint-config-next/core-web-vitals`; run `npm run lint` in `front/` before opening a PR.

## Testing Guidelines

There is no test runner configured yet. For backend behavior, add tests near the API code or under `back/src/**/__tests__/` once a runner is introduced. For frontend behavior, prefer component or page tests named `*.test.js` or `*.spec.js`. Until automated tests exist, document manual verification in PRs, including endpoints, browser flows, and Docker services used.

## Commit & Pull Request Guidelines

The history only shows `First commit`, so no strict convention is established. Use short, imperative messages such as `Add health endpoint` or `Configure frontend linting`. PRs should include a concise summary, linked issue when applicable, setup or migration notes, verification results, and screenshots for visible frontend changes.

## Security & Configuration Tips

Do not commit or alter `.env` files, secrets, database dumps, or generated dependency folders. Also do not alter docker-compose and Dockerfile files. Anything related to the infrastructure in general.

## Central documentation
* Always check and follow the relevant central documentation before implementing something that was asked.
* If a request goes against the relevant central documentation, do not change anything and bring up the conflict.
* The central documentation is your guide. Anything that is not coding and is not defined there should not be assumed; ask instead.
* Read `.agents/CORE/PROJECT-CONTEXT.md` when the task involves academic context, deadlines, deliverables, evaluation criteria or teacher expectations.
* Read `.agents/CORE/APPLICATION-SCOPE.md` when the task involves product scope, modules, business rules, entities, inventory flow, dashboard, permissions, integrations or features.
* Read `.agents/CORE/SOFTWARE-ARCHITECTURE.md` when the task involves implementation, architecture, layers, DTOs, services, controllers, repositories, middlewares, logs, errors, authentication, transactions or design patterns.
* Read `README.md` when the task involves installation, local execution, Docker, migrations, Prisma or operational infrastructure.

## Back-end
* After alterations on the API, the API should be documented in `front/docs/api/openapi.yml`
* This file will be read to create a visual page with @scalar

## Front-end
* For front-end, we'll use AND abuse of MUI Material
* Be careful with excessive local state in a single component. If a page needs to manage many unrelated states or responsibilities, it may be a sign that the component should be split into smaller components, custom hooks, or context providers.
* Use and abuse of the MUI's ability to design something once and enable it to be used across multiple places within the same theme. Specially with colors
