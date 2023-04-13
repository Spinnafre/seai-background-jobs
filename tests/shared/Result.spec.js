import { Result } from "../../src/utils/Result.js";

describe("Result", function () {
  test("Should be able to create a success message and throw error when access message", () => {
    const response = Result.success();

    expect(response.isSuccess).toBeTruthy();
    expect(response.isFailure).toBeFalsy();
  });

  test("Should be able to create a error message", () => {
    const response = Result.error("TEST");

    expect(response.isSuccess).toBeFalsy();
    expect(response.isFailure).toBeTruthy();
    expect(response.error).toEqual("TEST");
  });
});
