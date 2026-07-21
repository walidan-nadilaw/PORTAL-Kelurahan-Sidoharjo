import { describe, expect, it } from "vitest";
import { schemaTypes } from "./index";

const expectedNames = [
  "siteSettings",
  "post",
  "place",
  "staffMember",
  "umkm",
  "demographicStat",
  "blockContent",
];

describe("sanity schema", () => {
  it("registers exactly the seven content-model types", () => {
    expect(schemaTypes.map((t) => t.name).sort()).toEqual(
      [...expectedNames].sort(),
    );
  });

  it("every type declares a name and a type", () => {
    for (const type of schemaTypes) {
      expect(type.name).toBeTruthy();
      expect(type.type).toBeTruthy();
    }
  });
});
