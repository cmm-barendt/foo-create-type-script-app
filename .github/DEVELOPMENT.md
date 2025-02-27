# Development

> If you'd like a more guided walkthrough, see [Contributing to a create-typescript-app Repository](https://www.joshuakgoldberg.com/blog/contributing-to-a-create-typescript-app-repository).
> It'll walk you through the common activities you'll need to contribute.

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo) and [installing pnpm](https://pnpm.io/installation):

```shell
git clone https://github.com/<your-name-here>/create-typescript-app
cd create-typescript-app
pnpm install
```

> This repository includes a list of suggested VS Code extensions.
> It's a good idea to use [VS Code](https://code.visualstudio.com) and accept its suggestion to install them, as they'll help with development.

## Building

Run [**tsup**](https://tsup.egoist.dev) locally to build source files from `src/` into output files in `lib/`:

```shell
pnpm build
```

Add `--watch` to run the builder in a watch mode that continuously cleans and recreates `lib/` as you save files:

```shell
pnpm build --watch
```

## Formatting

[Prettier](https://prettier.io) is used to format code.
It should be applied automatically when you save files in VS Code or make a Git commit.

To manually reformat all files, you can run:

```shell
pnpm format --write
```

## Linting

This package includes several forms of linting to enforce consistent code quality and styling.
Each should be shown in VS Code, and can be run manually on the command-line:

- `pnpm lint` ([ESLint](https://eslint.org) with [typescript-eslint](https://typescript-eslint.io)): Lints JavaScript and TypeScript source files
- `pnpm lint:knip` ([knip](https://github.com/webpro/knip)): Detects unused files, dependencies, and code exports
- `pnpm lint:md` ([Markdownlint](https://github.com/DavidAnson/markdownlint)): Checks Markdown source files
- `pnpm lint:packages` ([pnpm dedupe --check](https://pnpm.io/cli/dedupe)): Checks for unnecessarily duplicated packages in the `pnpm-lock.yml` file
- `pnpm lint:spelling` ([cspell](https://cspell.org)): Spell checks across all source files

Read the individual documentation for each linter to understand how it can be configured and used best.

For example, ESLint can be run with `--fix` to auto-fix some lint rule complaints:

```shell
pnpm run lint --fix
```

Note that you'll likely need to run `pnpm build` before `pnpm lint` so that lint rules which check the file system can pick up on any built files.

## Testing

[Vitest](https://vitest.dev) is used for tests.
You can run it locally on the command-line:

```shell
pnpm run test
```

Add the `--coverage` flag to compute test coverage and place reports in the `coverage/` directory:

```shell
pnpm run test --coverage
```

Note that [console-fail-test](https://github.com/JoshuaKGoldberg/console-fail-test) is enabled for all test runs.
Calls to `console.log`, `console.warn`, and other console methods will cause a test to fail.

### Debugging Tests

This repository includes a [VS Code launch configuration](https://code.visualstudio.com/docs/editor/debugging) for debugging unit tests.
To launch it, open a test file, then run _Debug Current Test File_ from the VS Code Debug panel (or press F5).

## Type Checking

You should be able to see suggestions from [TypeScript](https://typescriptlang.org) in your editor for all open files.

However, it can be useful to run the TypeScript command-line (`tsc`) to type check all files in `src/`:

```shell
pnpm tsc
```

Add `--watch` to keep the type checker running in a watch mode that updates the display as you save files:

```shell
pnpm tsc --watch
```

## Debugging

This repository includes a [VS Code launch configuration](https://code.visualstudio.com/docs/editor/debugging) for debugging.
Depending upon the type of usage, it can include debugging for unit tests _and_ for executable (or "bin") apps.

### Unit Tests

To debug a unit test, open a test file, then run _Debug Current Test File_ from the VS Code Debug panel (or press F5).

### `bin` Apps

To debug a `bin` app, add a breakpoint to your code, then run _Debug Program_ from the VS Code Debug panel (or press F5).

## Setup Scripts

As described in the `README.md` file and `docs/`, this template repository comes with three scripts that can set up an existing or new repository.

Each follows roughly the same general flow:

1. `bin/index.ts` uses `bin/mode.ts` to determine which of the three setup scripts to run
2. `readOptions` parses in options from local files, Git commands, npm APIs, and/or files on disk
3. `runOrRestore` wraps the setup script's main logic in a friendly prompt wrapper
4. The setup script wraps each portion of its main logic with `withSpinner`
   - Each step of setup logic is generally imported from within `src/steps`
5. A call to `outro` summarizes the results for the user

> **Warning**
> Each setup script overrides many files in the directory they're run in.
> Make sure to save any changes you want to preserve before running them.

### The Creation Script

> 📝 See [`docs/Creation.md`](../docs/Creation.md) for user documentation on the creation script.

This template's "creation" script is located in `src/create/`.
You can run it locally with `node bin/index.js --mode create`.
Note that files need to be built with `pnpm run build` beforehand.

#### Testing the Creation Script

You can run the end-to-end test for creation locally on the command-line.
Note that the files need to be built with `pnpm run build` beforehand.

```shell
pnpm run test:create
```

That end-to-end test executes `script/create-test-e2e.ts`, which:

1. Runs the creation script to create a new `test-repository` child directory and repository, capturing code coverage
2. Asserts that commands such as `build` and `lint` each pass

The `pnpm run test:create` script is run in CI to ensure that templating changes are in sync with the template's actual files.
See `.github/workflows/test-create.yml`.

### The Initialization Script

> 📝 See [`docs/Initialization.md`](../docs/Initialization.md) for user documentation on the initialization script.

This template's "initialization" script is located in `src/initialize/`.
You can run it locally with `pnpm run initialize`.
It uses [`tsx`](https://github.com/esbuild-kit/tsx) so you don't need to build files before running.

```shell
pnpm run initialize
```

#### Testing the Initialization Script

You can run the end-to-end test for initializing locally on the command-line.
Note that files need to be built with `pnpm run build` beforehand.

```shell
pnpm run test:initialize
```

That end-to-end test executes `script/initialize-test-e2e.ts`, which:

1. Runs the initialization script using `--skip-github-api` and other skip flags
2. Checks that the local repository's files were changed correctly (e.g. removed initialization-only files)
3. Runs `pnpm run lint:knip` to make sure no excess dependencies or files were left over
4. Resets everything
5. Runs initialization a second time, capturing test coverage

The `pnpm run test:initialize` script is run in CI to ensure that templating changes are in sync with the template's actual files.
See `.github/workflows/test-initialize.yml`.

### The Migration Script

> 📝 See [`docs/Migration.md`](../docs/Migration.md) for user documentation on the migration script.

This template's "migration" script is located in `src/migrate/`.
Note that files need to be built with `pnpm run build` beforehand.

To test out the script locally, run it from a different repository's directory:

```shell
cd ../other-repo
node ../create-typescript-app/bin/migrate.js
```

The migration script will work on any directory.
You can try it out in a blank directory with scripts like:

```shell
cd ..
mkdir temp
cd temp
node ../create-typescript-app/bin/migrate.js
```

#### Testing the Migration Script

> 💡 Seeing `Oh no! Running the migrate script unexpectedly modified:` errors?
> _[Unexpected File Modifications](#unexpected-file-modifications)_ covers that below.

You can run the end-to-end test for migrating locally on the command-line:

```shell
pnpm run test:migrate
```

That end-to-end test executes `script/migrate-test-e2e.ts`, which:

1. Runs the migration script using `--skip-github-api` and other skip flags, capturing code coverage
2. Checks that only a small list of allowed files were changed
3. Checks that the local repository's files were changed correctly (e.g. removed initialization-only files)

The `pnpm run test:migrate` script is run in CI to ensure that templating changes are in sync with the template's actual files.
See `.github/workflows/test-migrate.yml`.

> Tip: if the migration test is failing in CI and you don't see any errors, try [downloading the full logs](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs#downloading-logs).

##### Migration Snapshot Failures

The migration test uses the [Vitest file snapshot](https://vitest.dev/guide/snapshot#file-snapshots) in `script/__snapshots__/migrate-test-e2e.ts.snap` to store expected differences to this repository after running the migration script.
The end-to-end migration test will fail any changes that don't keep the same differences in that snapshot.

You can update the snapshot file by:

1. Committing any changes to your local repository
2. Running `pnpm i` and `pnpm build` if any updates have been made to the `package.json` or `src/` files, respectively
3. Running `pnpm run test:migrate -u` to update the snapshot

At this point there will be some files changed:

- `script/__snapshots__/migrate-test-e2e.ts.snap` will have updates if any files mismatched templates
- The actual updated files on disk will be there too

If the snapshot file changes are what you expected, then you can commit them.
The rest of the file changes can be reverted.

> [🚀 Feature: Add a way to apply known file changes after migration #1184](https://github.com/JoshuaKGoldberg/create-typescript-app/issues/1184) tracks turning the test snapshot into a feature.

##### Unexpected File Modifications

The migration test also asserts that no files were unexpectedly changed.
If you see a failure like:

```plaintext
Oh no! Running the migrate script unexpectedly modified:
 - ...
```

...then that means the file generated from templates differs from what's checked into the repository.
This is most often caused by changes to templates not being applied to checked-in files too.

Templates for files are generally stored in [`src/steps/writing/creation`] under a path roughly corresponding to the file they describe.
For example, the template for `tsup.config.ts` is stored in [`src/steps/writing/creation/createTsupConfig.ts`](../src/steps/writing/creation/createTsupConfig.ts).
If the `createTsupConfig` function were to be modified without an equivalent change to `tsup.config.ts` -or vice-versa- then the migration test would report:

```plaintext
Oh no! Running the migrate script unexpectedly modified:
 - tsup.config.ts
```
