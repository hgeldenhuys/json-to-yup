import {JsonType} from "./schema";

export type JsonDataType =
    | "string"
    | "number"
    | "object"
    | "date"
    | "boolean"
    | "mixed"
    | "array";

export interface JsonData<T extends JsonDataType> {
  type: T;
}

export interface When {
  anyOf: [any];
  is: any;
  then?: JsonType;
  otherwise?: JsonType;
}