import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

test("login and account deletion attempts are rate limited", async (context) => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const loginStatuses = [];
  for (let attempt = 0; attempt < 11; attempt += 1) {
    const response = await fetch(`${origin}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    loginStatuses.push(response.status);
  }
  assert.equal(loginStatuses.filter((status) => status === 400).length, 10);
  assert.equal(loginStatuses.at(-1), 429);

  const deletionStatuses = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(`${origin}/api/player/account`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    deletionStatuses.push(response.status);
  }
  assert.equal(deletionStatuses.filter((status) => status === 401).length, 5);
  assert.equal(deletionStatuses.at(-1), 429);
});
