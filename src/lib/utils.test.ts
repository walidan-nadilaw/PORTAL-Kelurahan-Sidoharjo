import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("lets a later Tailwind class win over an earlier conflicting one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("block", false && "hidden", undefined, "text-sm")).toBe(
      "block text-sm",
    );
  });
});
