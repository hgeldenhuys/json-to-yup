import {JsonMixed} from "./mixed";

export interface JsonNumber extends JsonMixed<"number"> {
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  lessThan?: number | { value: number; message: string };
  moreThan?: number | { value: number; message: string };
  positive?: boolean | string;
  negative?: boolean | string;
  integer?: boolean | string;
  truncate?: boolean;
  round?: "floor" | "ceil" | "trunc" | "round";
}
