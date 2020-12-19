import * as yup from "yup";
import { JsonSchema } from "./schema";
export declare const jsonToYup: (js: JsonSchema) => yup.ObjectSchema<object & {
    [x: string]: any;
}>;
declare const _default: {
    jsonToYup: (js: JsonSchema) => yup.ObjectSchema<object & {
        [x: string]: any;
    }>;
};
export default _default;
