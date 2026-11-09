import test from "node:test";
import assert from "node:assert/strict";
import { getGrowthStage, isCropReady } from "../src/utils/cropGrowth.js";

const plantedAt = "2026-01-01T00:00:00.000Z";
const durationSeconds = 100;
const start = new Date(plantedAt).getTime();

test("new crops use stage 1", () => {
  assert.equal(getGrowthStage(plantedAt, durationSeconds, start), 1);
});

test("crops below halfway use stage 1", () => {
  assert.equal(getGrowthStage(plantedAt, durationSeconds, start + 49_999), 1);
});

test("crops at halfway use stage 2", () => {
  assert.equal(getGrowthStage(plantedAt, durationSeconds, start + 50_000), 2);
});

test("crops below completion use stage 2", () => {
  assert.equal(getGrowthStage(plantedAt, durationSeconds, start + 99_999), 2);
});

test("crops at completion use stage 3 and are ready", () => {
  const now = start + 100_000;
  assert.equal(getGrowthStage(plantedAt, durationSeconds, now), 3);
  assert.equal(isCropReady(plantedAt, durationSeconds, now), true);
});

test("growth remains based on the planting timestamp after a refresh", () => {
  assert.equal(getGrowthStage(plantedAt, durationSeconds, start + 75_000), 2);
});
