import { JsonString } from "./string";
import { JsonNumber } from "./number";
import { JsonBoolean } from "./boolean";
import { JsonDate } from "./date";
import { JsonArray } from "./array";
import {JsonMixed} from "./mixed";

export interface Shape {
  [key: string]:
    | JsonString
    | JsonNumber
    | JsonBoolean
    | JsonDate
    | JsonArray
    | JsonObject;
}

export interface JsonObject extends JsonMixed<"object"> {
  shape?: Shape;
  pick?: string[];
  omit?: string[];
  getDefaultFromShape?: boolean;
}
