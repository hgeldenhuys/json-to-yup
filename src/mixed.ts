import { JsonData, JsonDataType, When } from "./types";
import { JsonSchema } from "./schema";

export interface JsonMixed<T extends JsonDataType> extends JsonData<T> {
  label?: string;
  default?: any;
  nullable?: boolean;
  required?: boolean | string;
  notRequired?: boolean | string;
  ensure?: JsonSchema;
  strict?: boolean;
  typeError?: string;
  oneOf?: any[];
  notOneOf?: any[];
  when?: When;
}
