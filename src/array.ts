import { JsonData, JsonDataType } from "./types";
import { JsonMixed } from "./mixed";
import { JsonType } from "@/schema";

export interface JsonArray extends JsonMixed<"array"> {
  of?: JsonType;
  length?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  compact?: boolean;
}
