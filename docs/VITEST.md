# VITEST (Vite-native test framework)

Requires: Vite≥6.0.0, Node≥20.0.0

## CORE FEATURES

- Shared Vite config/transformers/resolvers/plugins
- Watch mode: auto in dev, run in CI (`process.env.CI`); `vitest watch|run`;
  `--standalone` keeps running, waits for changes
- ES Module/TypeScript/JSX/PostCSS out-of-box
- Parallelism: `node:child_process` default; `--pool=threads` uses
  `node:worker_threads` (faster, some pkg incompatible); `--no-isolate` disables
  env isolation
- `.concurrent` runs tests parallel; `.skip`/`.only`/`.todo` modifiers;
  concurrent tests require local `expect` from Test Context
- Jest-compatible snapshots
- Chai built-in + Jest `expect` API; `test.globals=true` for better 3rd-party
  matcher compat
- Tinyspy built-in for mocking via `vi`; jsdom/happy-dom for DOM (install
  separately)
- Coverage: v8 (native) or istanbul
- In-source testing via `import.meta.vitest`
- Benchmarking (experimental) via Tinybench
- Type testing (experimental) via expect-type
- Sharding: `--shard`+`--reporter=blob`, merge via `--merge-reports`
- Env vars: auto-loads `VITE_`-prefixed from .env; use `loadEnv` from vite for
  all
- Unhandled errors: caught/reported by default; disable with
  `dangerouslyIgnoreUnhandledErrors`

## INSTALL

```bash
npm i -D vitest
```

## BASIC

```ts
import { test, expect } from 'vitest';
test('adds', () => expect(1 + 2).toBe(3));
```

Run: `vitest` (watch) | `vitest run` (single)

## CONFIG

File: `vitest.config.ts` or `test` in `vite.config.ts`

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
	test: {
		/* opts */
	},
});
```

### OPTIONS (format: `name: type` [default] CLI: flags | notes)

**Core**

- `include: string[]` ['\*_/_.{test,spec}.?(c|m)[jt]s?(x)'] CLI:
  `vitest [...patterns]` | tinyglobby, relative to root
- `exclude: string[]` ['**/node_modules/**','**/.git/**'] CLI: `--exclude`
  (additive) | use configDefaults to extend
- `root: string` [process.cwd()] CLI: `-r, --root`
- `name: string|{label,color?}` | auto-assigns from package.json or folder; must
  be unique
- `testTimeout: number` [5000, 15000 if browser] CLI: `--test-timeout`;
  0=disable
- `setupFiles: string|string[]` | runs before each test file; rerun triggers on
  edit
- `globalSetup: string|string[]` | exports setup/teardown; runs only if tests
  exist; `provide` for data passing
- `globals: boolean` [false] CLI: `--globals` | add `vitest/globals` to tsconfig
  types
- `passWithNoTests: boolean` [false] CLI: `--passWithNoTests`
- `allowOnly: boolean` [!process.env.CI] CLI: `--allowOnly`

**Environment**

- `environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime'|string` [node] CLI:
  `--environment` | per-file via `@vitest-environment` docblock
- `environmentOptions: Record<string,unknown>` | keyed by env name (jsdom,
  happyDOM)

**Coverage** (CLI prefix: `--coverage.`)

- `provider: 'v8'|'istanbul'|'custom'` [v8]
- `enabled: boolean` [false]
- `include/exclude: string[]` | glob patterns
- `clean: boolean` [true] | clear before run
- `cleanOnRerun: boolean` [true]
- `reportsDirectory: string` ['./coverage']
- `reporter: string|string[]|[string,{}][]` [['text','html','clover','json']]
- `reportOnFailure: boolean` [false]
- `allowExternal: boolean` [false]
- `excludeAfterRemap: boolean` [false]
- `skipFull: boolean` [false]
- `thresholds: {lines,functions,branches,statements: number, perFile?: boolean, autoUpdate?: boolean|fn, 100?: boolean, [glob]: object}`
- `ignoreClassMethods: string[]` []
- `watermarks: {statements,functions,branches,lines: [low,high]}` [[50,80]...]
- `processingConcurrency: number` [min(20, cpus)]
- `customProviderModule: string` | for custom provider

**Pools**

- `pool: 'threads'|'forks'|'vmThreads'|'vmForks'` [forks] CLI: `--pool`
- `poolOptions.{threads|forks|vmThreads|vmForks}: object`
    - `minThreads/maxThreads: number`
    - `isolate: boolean` [true]
    - `singleThread/singleFork: boolean` [false]
    - `useAtomics: boolean` [false]
    - `execArgv: string[]`

**Isolation & Parallelism**

- `isolate: boolean` [true] CLI: `--no-isolate`
- `fileParallelism: boolean` [true] CLI: `--no-file-parallelism`

**Reporters** CLI: `--reporter`

- Built-in: default, basic, verbose, dot, json, tap, tap-flat, junit,
  hanging-process, github-actions, blob, html, tree
- `outputFile: string|Record<reporter,path>` | for json/junit/blob/html

**Sequence**

- `sequence.shuffle: boolean` [false] CLI: `--sequence.shuffle`
- `sequence.seed: number` CLI: `--sequence.seed`
- `sequence.concurrent: boolean` [false] CLI: `--sequence.concurrent`
- `sequence.hooks: 'stack'|'list'|'parallel'` [parallel]
- `sequence.setupFiles: 'list'|'parallel'` [parallel]

**Retry/Repeat**

- `retry: number` [0] CLI: `--retry`
- `repeats: number` [0] CLI: `--repeats`

**Deps**

- `deps.optimizer.{ssr|client}: {enabled,include,exclude,force}` | Vite dep
  optimization
- `deps.client.transformAssets/transformCss: boolean` [true] | vmThreads/vmForks
  only
- `deps.interopDefault: boolean` [true]
- `deps.moduleDirectories: string[]` ['node_modules']

**Mocking**

- `clearMocks: boolean` [false] | vi.clearAllMocks before each
- `mockReset: boolean` [false] | vi.resetAllMocks before each
- `restoreMocks: boolean` [false] | vi.restoreAllMocks before each
- `unstubGlobals: boolean` [false]
- `unstubEnvs: boolean` [false]

**Snapshots**

- `snapshotFormat: PrettyFormatOptions`
- `resolveSnapshotPath: (testPath,ext,ctx)=>string`
- `snapshotSerializers: string[]`
- `snapshotEnvironment: string` | custom impl
- `expandSnapshotDiff: boolean` [false] CLI: `--expandSnapshotDiff`
- `update: boolean` [false] CLI: `-u, --update`

**Typecheck** (experimental)

- `typecheck.enabled: boolean` [false] CLI: `--typecheck`
- `typecheck.only: boolean` [false]
- `typecheck.checker: 'tsc'|'vue-tsc'|string` [tsc]
- `typecheck.include/exclude: string[]`
- `typecheck.allowJs: boolean` [false]
- `typecheck.ignoreSourceErrors: boolean` [false]
- `typecheck.tsconfig: string`

**Fake Timers** (`fakeTimers` for vi.useFakeTimers)

- `now: number|Date` [Date.now()]
- `toFake: string[]` | methods to fake; nextTick not supported in forks pool
- `loopLimit: number` [10000]
- `shouldAdvanceTime: boolean` [false]
- `advanceTimeDelta: number` [20]
- `shouldClearNativeTimers: boolean` [true]

**Expect**

- `expect.requireAssertions: boolean` [false]
- `expect.poll: {interval: number, timeout: number}` [50, 1000]

**Chai**

- `chaiConfig: {includeStack: boolean, showDiff: boolean, truncateThreshold: number}`
  [false,true,40]

**Misc**

- `alias: Record<string,string>|Array<{find,replacement,customResolver?}>` |
  merged with resolve.alias
- `css: boolean|{include?,exclude?,modules?}` [false] | process CSS
- `logHeapUsage: boolean` [false] CLI: `--logHeapUsage`
- `dangerouslyIgnoreUnhandledErrors: boolean` [false]
- `forceRerunTriggers: string[]`
  ['**/package.json/**','**/vitest.config.*/**','**/vite.config.*/**']
- `includeSource: string[]` [] | in-source test globs
- `server: {deps,sourcemap}` | Vite server options for tests
- `inspect/inspectBrk: boolean|string` CLI: `--inspect`, `--inspect-brk`
- `slowTestThreshold: number` [300] | highlight slow tests
- `bail: number` [0] CLI: `--bail` | stop after N failures
- `cache: {dir: string}` | cache location
- `env: Record<string,string>` | process.env vars
- `attachmentsDir: string` ['.vitest-attachments']
- `execArgv: string[]` | node args for worker

**Experimental**

- `experimental.fsModuleCache: boolean` [false] | persistent cache
- `experimental.fsModuleCachePath: string`
  ['node_modules/.experimental-vitest-cache']
- `experimental.openTelemetry: {enabled,sdkPath?,browserSdkPath?}` | perf
  tracing
- `experimental.printImportBreakdown: boolean` [false]

**UI**

- `ui: boolean` [false] CLI: `--ui` | requires @vitest/ui
- `api: boolean|number|{port,host,strictPort}` [false, port 51204]

## CLI

```
vitest [filters] [options]
vitest run           # single run
vitest watch         # watch mode (default in dev)
vitest bench         # benchmarks
vitest init browser  # setup browser mode
vitest typecheck     # type tests only
vitest list          # list tests without running

--config/-c <path>   --root/-r <path>      --project <name>
--update/-u          --watch/-w            --run
--reporter <name>    --outputFile <path>   --coverage
--globals            --environment <env>   --pool <type>
--browser[=name]     --browser.headless    --no-isolate
--no-file-parallelism --test-timeout <ms>  --bail <n>
--retry <n>          --repeats <n>         --shard <i>/<n>
--merge-reports      --changed [ref]       --passWithNoTests
--sequence.shuffle   --sequence.seed <n>   --sequence.concurrent
--inspect-brk        --logHeapUsage        --clearCache
```

## ENVIRONMENTS

Built-in: `node` (default), `jsdom`, `happy-dom`, `edge-runtime` Per-file:
`// @vitest-environment <name>` or `/** @vitest-environment <name> */` Custom:
export `Environment` object with `{name, viteEnvironment, setup()}`

## TEST API

```ts
import {
	describe,
	test,
	it,
	expect,
	vi,
	beforeAll,
	beforeEach,
	afterAll,
	afterEach,
} from 'vitest';
```

### Suites

```ts
describe(name, fn, timeout?)
describe.skip/only/todo/skipIf(cond)/runIf(cond)/shuffle/concurrent/sequential/scoped
describe.each(table)(name, fn, timeout?) // parametrized: %s %d %i %f %j %o %# %%
```

### Tests

```ts
test(name, fn, timeout?)
test.skip/only/todo/skipIf(cond)/runIf(cond)/fails/concurrent/sequential/scoped
test.each(table)(name, fn, timeout?)
test.for(cases)(name, fn, timeout?) // parallel-safe alternative to .each
test.extend({fixtures}) // fixture injection
```

### Hooks

```ts
beforeAll(fn, timeout?)   afterAll(fn, timeout?)
beforeEach(fn, timeout?)  afterEach(fn, timeout?)
onTestFinished(fn)        onTestFailed(fn)
```

### Test Context

```ts
test('name', (context) => {
  context.task          // current test
  context.expect        // bound expect (required for concurrent)
  context.skip()        // skip dynamically
  await context.annotate(msg, type?, attachment?)
})
```

## EXPECT API

```ts
expect(value)
  .toBe(expected)                    // ===
  .toEqual(expected)                 // deep equal
  .toStrictEqual(expected)           // deep + type
  .toBeCloseTo(num, digits?)         // float
  .toBeDefined() / .toBeUndefined()
  .toBeNull() / .toBeTruthy() / .toBeFalsy() / .toBeNaN()
  .toBeTypeOf(type)                  // typeof
  .toBeInstanceOf(Class)
  .toBeGreaterThan(num) / .toBeGreaterThanOrEqual(num)
  .toBeLessThan(num) / .toBeLessThanOrEqual(num)
  .toContain(item)                   // array/string
  .toContainEqual(item)              // deep
  .toHaveLength(n)
  .toHaveProperty(path, value?)
  .toMatch(regex|string)
  .toMatchObject(obj)
  .toMatchSnapshot(name?) / .toMatchInlineSnapshot(snapshot?)
  .toMatchFileSnapshot(path)
  .toThrow(error?) / .toThrowError(msg|regex|class)
  .resolves / .rejects                // promise
  .toHaveBeenCalled() / .toHaveBeenCalledTimes(n)
  .toHaveBeenCalledWith(...args) / .toHaveBeenLastCalledWith(...args)
  .toHaveBeenNthCalledWith(n, ...args)
  .toHaveReturned() / .toHaveReturnedTimes(n)
  .toHaveReturnedWith(value) / .toHaveLastReturnedWith(value)
  .toSatisfy(predicate)

.not                                 // negate
expect.soft(value)                   // continue on fail
expect.poll(fn, opts?)               // retry until pass
expect.extend({matchers})            // custom matchers
expect.assertions(n)                 // count assertions
expect.hasAssertions()               // at least one
expect.anything()                    // any non-null
expect.any(Class)                    // instanceof
expect.arrayContaining(arr)
expect.objectContaining(obj)
expect.stringContaining(str)
expect.stringMatching(regex)
expect.addSnapshotSerializer(serializer)
```

## VI (Mock Utilities)

```ts
import { vi } from 'vitest'

// Functions
vi.fn(impl?)                         // create mock fn
vi.spyOn(obj, method, accessType?)   // spy; accessType: 'get'|'set'
vi.isMockFunction(fn)

// Mock methods (on mock fn)
mock.mockImplementation(fn)
mock.mockImplementationOnce(fn)
mock.mockReturnValue(value)
mock.mockReturnValueOnce(value)
mock.mockResolvedValue(value)
mock.mockResolvedValueOnce(value)
mock.mockRejectedValue(error)
mock.mockRejectedValueOnce(error)
mock.mockClear()                     // clear call history
mock.mockReset()                     // + reset impl
mock.mockRestore()                   // restore original (spyOn only)
mock.getMockName() / .mockName(name)
mock.getMockImplementation()
mock.mock.calls                      // [[args], ...]
mock.mock.results                    // [{type,value}, ...]
mock.mock.instances                  // [this, ...]
mock.mock.contexts                   // [context, ...]
mock.mock.lastCall                   // last args

// Modules
vi.mock(path, factory?)              // mock module; hoisted
vi.mock(import(path), factory?)      // better IDE support
vi.mock(path, { spy: true })         // automock with spies
vi.doMock(path, factory?)            // not hoisted
vi.unmock(path) / vi.doUnmock(path)
vi.importActual(path)                // get original in factory
vi.importMock(path)                  // get mocked
vi.mocked(obj, deep?)                // TS: typed mock
vi.hoisted(factory)                  // hoist to top

// Timers
vi.useFakeTimers(opts?)              // enable fake timers
vi.useRealTimers()                   // restore
vi.setSystemTime(date)               // set Date.now()
vi.getMockedSystemTime()
vi.getRealSystemTime()
vi.runAllTimers()                    // run all pending
vi.runOnlyPendingTimers()
vi.runAllTimersAsync()
vi.advanceTimersByTime(ms)
vi.advanceTimersByTimeAsync(ms)
vi.advanceTimersToNextTimer(steps?)
vi.advanceTimersToNextTimerAsync(steps?)
vi.getTimerCount()
vi.clearAllTimers()

// Globals
vi.stubGlobal(name, value)           // set globalThis[name]
vi.unstubAllGlobals()
vi.stubEnv(name, value)              // set import.meta.env[name]
vi.unstubAllEnvs()

// Utils
vi.spyOn(console, 'log')             // common pattern
vi.resetAllMocks()
vi.restoreAllMocks()
vi.clearAllMocks()
vi.dynamicImportSettled()            // wait for imports
vi.waitFor(callback, opts?)          // poll until truthy
vi.waitUntil(callback, opts?)        // poll until truthy
vi.setConfig(opts)                   // runtime config
vi.resetConfig()
```

## MOCKING PATTERNS

### Module Mock

```ts
vi.mock('./mod', () => ({ fn: vi.fn() }));
vi.mock(import('./mod'), () => ({ fn: vi.fn() })); // better types
vi.mock('./mod', { spy: true }); // automock
```

### Partial Mock

```ts
vi.mock('./mod', async (importOriginal) => ({
	...(await importOriginal()),
	fn: vi.fn(),
}));
```

### Spy on Export

```ts
import * as mod from './mod';
vi.spyOn(mod, 'fn');
vi.spyOn(mod, 'value', 'get').mockReturnValue('x');
```

### Class Mock

```ts
vi.mock('./mod', () => ({
	MyClass: vi.fn(
		class {
			method = vi.fn();
		},
	),
}));
```

### Timer Mock

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-01'));
vi.advanceTimersByTime(1000);
vi.runAllTimers();
vi.useRealTimers();
```

### Request Mock (MSW)

```ts
import { setupServer } from 'msw/node';
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### File System Mock (memfs)

```ts
vi.mock('fs', async () => (await import('memfs')).fs);
vi.mock('fs/promises', async () => (await import('memfs')).fs.promises);
```

## BROWSER MODE

Runs tests in real browsers via Playwright/WebdriverIO/preview.

### Config

```ts
test: {
  browser: {
    enabled: true,
    provider: playwright({ launch: { headless: true } }), // or webdriverio()
    // provider options: preview (limited), playwright (recommended), webdriverio
    instances: [{ browser: 'chromium' }, { browser: 'firefox' }],
    headless: boolean,                // default: process.env.CI
    api: number|{port,host},          // default: 63315
    viewport: { width, height },
    screenshotDirectory: string,
    screenshotFailures: boolean,
    locators: { testIdAttribute: string }
  }
}
```

### Browser API

```ts
import { page, userEvent, expect, server, commands, cdp } from 'vitest/browser'

// Locators
page.getByRole(role, opts?)
page.getByText(text, opts?)
page.getByTestId(id)
page.getByLabelText(text, opts?)
page.getByPlaceholder(text, opts?)
page.getByAltText(text, opts?)
page.getByTitle(text, opts?)
page.elementLocator(element)

// Locator methods
locator.click(opts?)
locator.fill(value)
locator.clear()
locator.selectOptions(values)
locator.screenshot(opts?)
locator.query() / .all() / .elements()
locator.nth(n) / .first() / .last()
locator.element()

// User Events (real browser events via CDP/WebDriver)
userEvent.click(el, opts?)
userEvent.dblClick(el, opts?)
userEvent.tripleClick(el, opts?)
userEvent.fill(el, text, opts?)        // fast, clears first
userEvent.type(el, text, opts?)        // slow, keyboard syntax
userEvent.clear(el)
userEvent.hover(el) / .unhover(el)
userEvent.keyboard(text)               // {Shift}, {Enter}, etc
userEvent.tab()
userEvent.dragAndDrop(src, tgt, opts?)
userEvent.upload(el, files)
userEvent.copy() / .cut() / .paste()

// Page
page.screenshot(opts?)
page.extend({commands})
page.imageSnapshot(locator?, opts?)

// Commands
commands.readFile(path)
commands.writeFile(path, data)
commands.removeFile(path)

// CDP (Playwright/WebdriverIO chromium only)
cdp().send(method, params?)
cdp().on(event, handler)
```

### Browser Limitations

- No `alert`/`confirm`/`prompt` (mocked by default)
- No `vi.spyOn` on imports (use `vi.mock({spy:true})`)
- Use `userEvent` not `@testing-library/user-event`

## PROJECTS

```ts
export default defineConfig({
	test: {
		projects: [
			'packages/*', // glob
			{ test: { name: 'unit' } }, // inline
			'./e2e/vitest.config.ts', // file
		],
	},
});
```

- Root config = global opts (reporters, coverage)
- Filter: `--project <name>`
- Each project can have own: environment, pool, setupFiles, browser config

## COVERAGE

### Providers

- **v8** (default): Native V8 inspector; faster, lower memory; no pre-transpile;
  AST-based remapping in v3.2+
- **istanbul**: Instrumentation-based; battle-tested; works everywhere; slower
  due to instrumentation

### Ignore Comments

```ts
/* v8 ignore next */
/* v8 ignore next 3 */
/* v8 ignore start */ ... /* v8 ignore stop */
/* v8 ignore if */
/* v8 ignore else */
/* v8 ignore file */
// For esbuild (strips comments), add @preserve:
/* v8 ignore next -- @preserve */
```

## IN-SOURCE TESTING

```ts
// src/utils.ts
export const add = (a, b) => a + b;

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('adds', () => expect(add(1, 2)).toBe(3));
}
```

Config: `includeSource: ['src/**/*.ts']` Build:
`define: { 'import.meta.vitest': 'undefined' }` for dead code elimination
TypeScript: add `vitest/importMeta` to tsconfig types

## SNAPSHOTS

```ts
expect(obj).toMatchSnapshot();
expect(obj).toMatchInlineSnapshot();
expect(obj).toMatchFileSnapshot('./snap.txt');
expect.addSnapshotSerializer({ serialize, test });
```

Update: `vitest -u` or press `u` in watch mode

## ANNOTATIONS

```ts
test('name', async ({ annotate }) => {
	await annotate('message', 'notice'); // notice|warning|error
	await annotate('msg', 'info', {
		path: './file.txt',
		contentType: 'text/plain',
	});
});
```

## SHARDING

```bash
vitest --shard=1/3 --reporter=blob
vitest --shard=2/3 --reporter=blob
vitest --shard=3/3 --reporter=blob
vitest --merge-reports --reporter=default --coverage.reporter=text
```

## PERFORMANCE

- `--pool=threads` faster than forks (if compatible)
- `--no-isolate` if no side effects
- `--no-file-parallelism` reduces startup
- `test.dir` limits file search
- `deps.optimizer` for many imports
- `vmThreads`/`vmForks` fastest (memory leak risk)
- `experimental.fsModuleCache` for reruns

## DEBUGGING

```bash
vitest --inspect-brk --no-file-parallelism
```

VS Code: JavaScript Debug Terminal or launch.json with
`program: node_modules/vitest/vitest.mjs`

## COMMON ERRORS

- **Cannot find module**: Check path; use `vite-tsconfig-paths` for baseUrl;
  avoid relative aliases
- **Failed to terminate worker**: Switch to `pool: 'forks'` (fetch + threads
  issue)
- **Segfaults**: Native modules not thread-safe; use `pool: 'forks'`

## V4 MIGRATION

- Coverage: `coverage.all` removed; define `coverage.include` explicitly
- `exclude` simplified (only node_modules/.git by default)
- `vi.fn()`/`vi.spyOn` support constructors (use class/function, not arrow)
- `vi.restoreAllMocks` only restores `vi.spyOn` mocks (not automocks)
- `workspace` renamed to `projects`
- Browser provider: object syntax required (`playwright()` not `'playwright'`)
- `@vitest/browser/context` → `vitest/browser`
