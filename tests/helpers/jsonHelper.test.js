import {
  parseJSONValues,
  getAllValuesGivenKey,
} from "../../helpers/jsonHelper";

test("Sample test", () => {
  expect(true).toBe(true);
});

describe("parseJSONValues", () => {
  it("should properly parse JSON values in nested structures", () => {
    const input = {
      a: "[1, 2, 3]",
      b: {
        c: '{"nested": true}',
        d: "plain string",
      },
      e: 42,
    };

    const expectedOutput = {
      a: [1, 2, 3],
      b: {
        c: { nested: true },
        d: "plain string",
      },
      e: 42,
    };

    expect(parseJSONValues(input)).toEqual(expectedOutput);
  });

  it("should return the input unchanged for non-string values", () => {
    const input = 42;
    expect(parseJSONValues(input)).toEqual(input);
  });

  it("should return the input unchanged for invalid JSON strings", () => {
    const input = "{invalid: JSON}";
    expect(parseJSONValues(input)).toEqual(input);
  });
});

describe("getAllValuesGivenKey", () => {
  it("should return all values given a key", () => {
    const data = {
      a: { id: 1, value: "A" },
      b: { id: 2, value: "B" },
      c: { id: 3, value: "C" },
    };

    const key = "value";
    const expectedValues = ["A", "B", "C"];

    expect(getAllValuesGivenKey(data, key)).toEqual(expectedValues);
  });

  it("should return an array of undefined values if the key is not present", () => {
    const data = {
      a: { id: 1, value: "A" },
      b: { id: 2, value: "B" },
      c: { id: 3, value: "C" },
    };

    const key = "nonexistentKey";
    const expectedValues = [undefined, undefined, undefined];

    expect(getAllValuesGivenKey(data, key)).toEqual(expectedValues);
  });

  it("should handle arrays in the input data", () => {
    const data = {
      a: [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
      ],
      b: { id: 3, value: "C" },
    };

    const key = "value";
    const expectedValues = ["A", "B", "C"];

    expect(getAllValuesGivenKey(data, key)).toEqual(expectedValues);
  });
});
