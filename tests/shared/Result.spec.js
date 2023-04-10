import { Result } from "../../src/utils/Result.js";

describe("Result", function () {
  test("Should be able to create a success message and throw error when access message", () => {
    const response = Result.success();

    expect(response.status).toBe("SUCCESS");
    expect(response.isSuccess).toBeTruthy();
    expect(response.isFailure).toBeFalsy();
    expect(() => response.message).toThrow(
      new Error(
        "Can't get the value of an message result. Use 'message' instead."
      )
    );
  });

  test("Should be able to create a error message", () => {
    const response = Result.error({ error: "TEST" });

    expect(response.status).toBe("ERROR");
    expect(response.isSuccess).toBeFalsy();
    expect(response.isFailure).toBeTruthy();
    expect(response.message).toEqual("TEST");
  });

  test("Should be able to create a warning message", () => {
    const response = Result.warning({ message: "TEST" });

    expect(response.status).toBe("WARNING");
    expect(response.isSuccess).toBeTruthy();
    expect(response.isFailure).toBeFalsy();
    expect(response.message).toEqual("TEST");
  });
});
