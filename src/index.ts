import * as yup from "yup";
import { Schema } from "yup";
import { JsonSchema, JsonType } from "@/schema";
import { When } from "@/types";

const yupMap: { [key: string]: () => any } = {
  string: yup.string,
  number: yup.number,
  boolean: yup.boolean,
  array: yup.array,
  mixed: yup.mixed,
  date: yup.date,
  object: yup.object,
};

const yupSchema = (attribute: JsonType) => {
  let yupFn = yupMap[attribute.type]();
  Object.keys(attribute).forEach((property) => {
    const value = (attribute as any)[property];
    switch (property) {
      case "type": {
        break;
      }
      case "when": {
        const when = attribute[property] as When;
        const then = when.then ? yupSchema(when.then) : undefined;
        const otherwise = when.otherwise
          ? yupSchema(when.otherwise)
          : undefined;
        yupFn = yupFn.when(when.anyOf, {
          is: when.is,
          otherwise,
          then,
        });
        break;
      }
      default: {
        if (typeof value === "boolean") {
          if (value) yupFn = yupFn[property]();
        } else if (value && value.message) {
          yupFn[property](value.value, value.message);
        } else {
          yupFn = yupFn[property](value);
        }
      }
    }
  });
  return yupFn;
};

export const jsonToYup = (js: JsonSchema) => {
  const fields: Record<string, Schema<any>> = {};
  Object.keys(js).forEach((attributeName) => {
    const attribute = js[attributeName];
    fields[attributeName] = yupSchema(attribute);
  });
  return yup.object().shape(fields);
};

export default {
  jsonToYup,
};
