# Copilot Instructions

## Project Overview

This is a TypeScript project using **neverthrow** for safe functional error handling with the `Result` type. Built with SWC for compilation, ts-node for execution, and ESLint (typescript-eslint) for linting.

## Core Principles

### 1. Always Use `neverthrow` Result Type for Error Handling

- **Never** throw errors or use try/catch for control flow in application code.
- Every function that can fail **must** return `Result<T, E>` — never `T | null`, `T | undefined`, or thrown errors.
- Prefer `ok(value)` for success and `err(error)` for failure.
- Use `Result.match()` for handling results when you need branching logic.
- Use `.map()`, `.mapErr()`, `.andThen()`, `.orElse()` for composable transformations.
- Use `.unwrapOr(default)` only at application boundaries (e.g., CLI output, API responses).

### 2. TypeScript Configuration

- Target: ES2020, Module: CommonJS
- Strict mode is **enabled** — never disable strict checks.
- Source files live in `src/`, compiled output goes to `dist/`.
- Use `import`/`export` (ESM syntax) even though the runtime module is CommonJS (Node 18+ supports this via ts-node).

### 3. Code Style

- Max line length: **120 characters** (enforced by ESLint).
- Ignore args prefixed with `_` (e.g., `(_arg) => ...`).
- `explicit-function-return-type` is **warned** — prefer adding return types for public/exported functions.
- `no-console` is **off** — `console.log`/`console.error` are fine for development and debugging.

### 4. Project Scripts

| Script      | Command              | Description                  |
| ----------- | -------------------- | ---------------------------- |
| `dev`       | `ts-node src/index.ts` | Run with ts-node (dev)     |
| `build`     | `swc src -d dist`    | Compile to `dist/`           |
| `lint`      | `eslint .`           | Lint all TypeScript files     |
| `clean`     | `rm -rf dist`        | Remove build artifacts        |

- **Always** use `pnpm` — the project enforces this via `preinstall` hook.
- Node >= 18.0.0, pnpm >= 9.0.0 required.

### 5. File Structure Conventions

- All source files go under `src/`.
- Do not modify files in `dist/`, `node_modules/`, or `swcrc`.
- ESLint ignores `dist/**` and `node_modules/**`.

### 6. neverthrow Patterns to Follow

```typescript
// Chaining operations
const result = await fetchUser(id)
  .andThen(fetchProfile)
  .map(transform);

// Providing defaults at boundaries
const name = userResult.unwrapOr("Anonymous");

// Destructuring results
const { value, isOk } = userResult;

// Pattern matching
userResult.match(
  (data) => /* success */,
  (error) => /* failure */
);

// Type narrowing with isOk/isErr
if (result.isOk()) {
  console.log(result.value); // TS knows this is User
} else {
  console.error(result.error); // TS knows this is Error
}
```

### 7. Linting Rules (typescript-eslint)

- `@typescript-eslint/no-unused-vars`: args starting with `_` are ignored.
- `@typescript-eslint/explicit-function-return-type`: warned (not error).
- `no-console`: off.
- `max-len`: warned at 120 chars.

### 8. General Development Practices

- Keep functions small and focused — each should do one thing.
- Prefer composition with `andThen`/`map` over nested `match` calls.
- Use descriptive error types — consider creating custom error types via interfaces rather than raw `Error` objects when the error carries structured data.
- When creating new modules, export only public APIs; keep helpers private.
- Run `pnpm lint` before committing — fix all errors, address warnings.
- When adding dependencies, use `pnpm add <pkg>` (never npm or yarn).
