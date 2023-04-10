import { Result } from "../../src/utils/Result.js";

describe("Result", function () {
  test("Should be able to create a success message and throw error when access message", () => {
    const response = Result.success("Create a user");

    expect(response.status).toBe("SUCCESS");
    expect(response.operation).toBe("Create a user");
    expect(() => response.message).toThrow(
      new Error(
        "Can't get the value of an message result. Use 'message' instead."
      )
    );
    expect(response.date).toBeGreaterThan(0);
  });

  test("Should be able to create a error message", () => {
    const response = Result.error("test", "Test error message");

    expect(response.status).toBe("ERROR");
    expect(response.operation).toBe("test");
    expect(response.message).toEqual("Test error message");
    expect(response.date).toBeGreaterThan(0);
  });

  test("Should be able to create a warning message", () => {
    const response = Result.warning("test", "test only");

    expect(response.status).toBe("WARNING");
    expect(response.operation).toBe("test");
    expect(response.message).toEqual("test only");
    expect(response.date).toBeGreaterThan(0);
  });
});
