const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/api.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;

function loadApi({ browser = true, env = {}, response = {}, status = 200 } = {}) {
  const calls = [];
  const storage = new Map();
  const exports = {};
  const context = {
    exports,
    process: { env },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return {
        ok: status >= 200 && status < 300,
        status,
        statusText: 'Request failed',
        json: async () => response,
      };
    },
  };
  if (browser) {
    context.window = {};
    context.localStorage = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    };
  }
  vm.runInNewContext(compiled, context);
  return { ...exports, calls, storage };
}

for (const endpoint of ['/auth/register', '/auth/login']) {
  test(`${endpoint} stays same-origin even with a legacy localhost environment`, async () => {
    const body = { email: 'customer@example.test', password: 'TestPassword123!' };
    const response = { accessToken: 'test-token', user: { role: 'customer' } };
    const client = loadApi({
      env: {
        NEXT_PUBLIC_API_URL: 'http://localhost:4000/api',
        API_URL: 'http://127.0.0.1:4000/api',
      },
      response,
    });
    client.setToken('old-token');
    assert.deepEqual(await client.api(endpoint, { method: 'POST', body, auth: false }), response);
    const { url, options } = client.calls[0];
    assert.equal(url, `/api${endpoint}`);
    assert.equal(options.method, 'POST');
    assert.equal(options.body, JSON.stringify(body));
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.headers['Content-Type'], 'application/json');
  });
}

test('authenticated requests retain their bearer token and logout removes it', async () => {
  const client = loadApi();
  client.setToken('test-token');
  await client.api('/users/me');
  assert.equal(client.calls[0].url, '/api/users/me');
  assert.equal(client.calls[0].options.headers.Authorization, 'Bearer test-token');
  client.setToken(null);
  await client.api('/users/me');
  assert.equal(client.calls[1].options.headers.Authorization, undefined);
});

for (const [status, message] of [
  [401, 'Invalid credentials'],
  [409, 'Email already registered'],
  [400, ['email must be an email', 'password must be longer than or equal to 8 characters']],
]) {
  test(`authentication errors preserve status ${status} and backend messages`, async () => {
    const client = loadApi({ status, response: { message } });
    await assert.rejects(client.api('/auth/login', { method: 'POST', auth: false }), (error) => {
      assert.ok(error instanceof client.ApiError);
      assert.equal(error.status, status);
      assert.equal(error.message, Array.isArray(message) ? message.join(', ') : message);
      return true;
    });
  });
}

test('server-side requests use the internal API without browser storage', async () => {
  const client = loadApi({ browser: false });
  await client.api('/products');
  assert.equal(client.calls[0].url, 'http://127.0.0.1:4000/api/products');
  assert.equal(client.calls[0].options.headers.Authorization, undefined);
});

test('server-side requests support a custom server-only API address', async () => {
  const client = loadApi({ browser: false, env: { API_URL: 'http://backend:4100/api' } });
  await client.api('/products');
  assert.equal(client.calls[0].url, 'http://backend:4100/api/products');
});

test('Next.js proxies same-origin API paths to the backend', async () => {
  const configSource = fs.readFileSync(path.join(__dirname, '../next.config.js'), 'utf8');
  for (const [env, destination] of [
    [{ NEXT_PUBLIC_API_URL: 'http://localhost:4000/api' }, 'http://127.0.0.1:4000/api/:path*'],
    [{ API_URL: 'http://backend:4100/api/' }, 'http://backend:4100/api/:path*'],
  ]) {
    const context = { module: { exports: {} }, process: { env } };
    vm.runInNewContext(configSource, context);
    const rules = await context.module.exports.rewrites();
    assert.equal(rules.length, 1);
    assert.equal(rules[0].source, '/api/:path*');
    assert.equal(rules[0].destination, destination);
  }
});
