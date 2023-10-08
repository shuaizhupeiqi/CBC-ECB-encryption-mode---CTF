import { reverseGeocode } from "../../helpers/locationHelper";

describe("reverseGeocode", () => {
  it("should return the correct suburb, state, and postcode for a given latitude and longitude", async () => {
    const expectedOutput = {
      suburb: "Aeroglen",
      state: "QLD",
      postcode: "4870",
    };

    const actualOutput = await reverseGeocode(-16.88, 145.75);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should return null if invalid lat or lng data", async () => {
    const actualOutput = await reverseGeocode(null, null);

    expect(actualOutput).toBeNull();
  });
});
