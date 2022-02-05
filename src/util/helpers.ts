import { XMLParser } from "fast-xml-parser";
import camelcaseKeys from "camelcase-keys";
import { camelCase } from "lodash-es";
import humanizeDuration from "humanize-duration";

export function parseResponse<T>(data: string, modelName: string): T[] {
  return camelcaseKeys(
    [
      new XMLParser().parse(data)?.[`ArrayOf${modelName}`]?.[
        camelCase(modelName)
      ] || [],
    ].flat(),
    { deep: true }
  );
}

export const baseDirections = ["Southbound", "Northbound"];

export const englishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});
