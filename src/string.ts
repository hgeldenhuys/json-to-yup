import {JsonMixed} from "./mixed";

export interface JsonString extends JsonMixed<"string"> {
  length?: number | { value: number; message: string };
  email?: string | { value: string; message: string };
  url?: string | { value: string; message: string };
  uuid?: string | { value: string; message: string };
  trim?: boolean | string;
  lowercase?: boolean | string;
  uppercase?: boolean | string;
}