import {JsonMixed} from "./mixed";

export interface JsonDate extends JsonMixed<"date"> {
  min: string | number | { value: string | number; message: string };
  max: string | number | { value: string | number; message: string };
}
