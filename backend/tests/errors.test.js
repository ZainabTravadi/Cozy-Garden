import test from "node:test";
import assert from "node:assert/strict";
import { errorHandler } from "../src/middleware/errors.js";

function responseMock() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("malformed and oversized request bodies return safe client errors", () => {
  const malformed = responseMock();
  errorHandler({ type: "entity.parse.failed", body: "password=secret" }, {}, malformed, () => {});
  assert.equal(malformed.statusCode, 400);
  assert.deepEqual(malformed.body, { message: "Invalid JSON request body." });
  assert.equal(JSON.stringify(malformed.body).includes("secret"), false);

  const oversized = responseMock();
  errorHandler({ type: "entity.too.large", body: "private data" }, {}, oversized, () => {});
  assert.equal(oversized.statusCode, 413);
  assert.deepEqual(oversized.body, { message: "Request body is too large." });
});

test("production error logs omit internal messages and request content", () => {
  const previousEnvironment = process.env.NODE_ENV;
  const originalConsoleError = console.error;
  const logged = [];
  const response = responseMock();
  try {
    process.env.NODE_ENV = "production";
    console.error = (...args) => logged.push(args.join(" "));
    errorHandler({ name: "DatabaseError", message: "sensitive query and password" }, {}, response, () => {});
  } finally {
    console.error = originalConsoleError;
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
  }
  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, { message: "An unexpected server error occurred." });
  assert.equal(logged.join(" ").includes("password"), false);
});
