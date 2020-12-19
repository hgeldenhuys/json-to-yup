import { JsonData, JsonDataType } from "./types";
import { JsonMixed } from "./mixed";

export interface JsonArray extends JsonMixed<"array"> {
  of?: JsonData<JsonDataType>[];
  length?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  compact?: boolean;
}
