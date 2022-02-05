import { XMLParser } from "fast-xml-parser";
import camelcaseKeys from "camelcase-keys";
import { camelCase } from "lodash-es";

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
