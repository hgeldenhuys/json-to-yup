import * as yup from "yup";
import { ObjectSchema } from "yup";
export declare type HashMap = {
    [key: string]: HashMap | string | number | RegExp | boolean | ObjectSchema;
};
export declare class ValidatorException extends Error {
}
declare const _default: {
    jsonToSchema: (js: HashMap) => yup.ObjectSchema<object & {
        [x: string]: any;
    }>;
};
export default _default;
