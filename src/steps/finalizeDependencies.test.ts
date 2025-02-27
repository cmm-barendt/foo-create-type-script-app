import { describe, expect, it, vi } from "vitest";

import { Options } from "../shared/types.js";
import { finalizeDependencies } from "./finalizeDependencies.js";

const mockExecaCommand = vi.fn();

vi.mock("execa", () => ({
	get execaCommand() {
		return mockExecaCommand;
	},
}));

vi.mock("../shared/packages.js", () => ({
	readPackageData: () => [],
	removeDependencies: vi.fn(),
}));

const options = {
	access: "public",
	base: "everything",
	description: "Stub description.",
	directory: ".",
	email: {
		github: "github@email.com",
		npm: "npm@email.com",
	},
	mode: "create",
	owner: "StubOwner",
	repository: "stub-repository",
	title: "Stub Title",
} satisfies Options;

describe("finalize", () => {
	it("installs the full list of commands when no options are enabled", async () => {
		await finalizeDependencies(options);

		expect(mockExecaCommand.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "pnpm add @eslint-community/eslint-plugin-eslint-comments@latest @eslint/js@latest @release-it/conventional-changelog@latest @types/eslint-plugin-markdown@latest @vitest/coverage-v8@latest all-contributors-cli@latest console-fail-test@latest cspell@latest eslint@latest eslint-plugin-jsdoc@latest eslint-plugin-jsonc@latest eslint-plugin-markdown@latest eslint-plugin-n@latest eslint-plugin-package-json@latest eslint-plugin-perfectionist@latest eslint-plugin-regexp@latest eslint-plugin-vitest@latest eslint-plugin-yml@latest husky@latest jsonc-eslint-parser@latest knip@latest lint-staged@latest markdownlint@latest markdownlint-cli@latest prettier@latest prettier-plugin-curly@latest prettier-plugin-packagejson@latest release-it@latest sentences-per-line@latest tsup@latest typescript@latest typescript-eslint@latest vitest@latest -D",
			  ],
			  [
			    "npx all-contributors-cli generate",
			  ],
			  [
			    "pnpm dedupe",
			  ],
			]
		`);
	});

	it("installs in offline mode when options.offline is true", async () => {
		await finalizeDependencies({
			...options,
			offline: true,
		});

		expect(mockExecaCommand.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "pnpm add @eslint-community/eslint-plugin-eslint-comments@latest @eslint/js@latest @release-it/conventional-changelog@latest @types/eslint-plugin-markdown@latest @vitest/coverage-v8@latest all-contributors-cli@latest console-fail-test@latest cspell@latest eslint@latest eslint-plugin-jsdoc@latest eslint-plugin-jsonc@latest eslint-plugin-markdown@latest eslint-plugin-n@latest eslint-plugin-package-json@latest eslint-plugin-perfectionist@latest eslint-plugin-regexp@latest eslint-plugin-vitest@latest eslint-plugin-yml@latest husky@latest jsonc-eslint-parser@latest knip@latest lint-staged@latest markdownlint@latest markdownlint-cli@latest prettier@latest prettier-plugin-curly@latest prettier-plugin-packagejson@latest release-it@latest sentences-per-line@latest tsup@latest typescript@latest typescript-eslint@latest vitest@latest -D --offline",
			  ],
			  [
			    "npx all-contributors-cli generate",
			  ],
			  [
			    "pnpm dedupe",
			  ],
			]
		`);
	});

	it("installs the base list of commands when all options are enabled", async () => {
		await finalizeDependencies({
			...options,
			excludeAllContributors: true,
			excludeCompliance: true,
			excludeLintJson: true,
			excludeLintKnip: true,
			excludeLintMd: true,
			excludeLintPackageJson: true,
			excludeLintPackages: true,
			excludeLintPerfectionist: true,
			excludeLintSpelling: true,
			excludeLintYml: true,
			excludeReleases: true,
			excludeRenovate: undefined,
			excludeTests: true,
		});

		expect(mockExecaCommand.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "pnpm add @eslint-community/eslint-plugin-eslint-comments@latest @eslint/js@latest @types/eslint-plugin-markdown@latest eslint@latest eslint-plugin-jsdoc@latest eslint-plugin-n@latest eslint-plugin-regexp@latest husky@latest lint-staged@latest prettier@latest prettier-plugin-curly@latest prettier-plugin-packagejson@latest tsup@latest typescript@latest typescript-eslint@latest -D",
			  ],
			  [
			    "pnpm dedupe",
			  ],
			]
		`);
	});
});
