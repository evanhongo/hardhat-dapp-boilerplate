import { describe, test, expect } from "@jest/globals";

describe("simple test", () => {
  test("it should return true", () => {
    expect(1).toBeLessThanOrEqual(10);
  });
});