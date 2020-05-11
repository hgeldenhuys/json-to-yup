import * as yup from "yup";
import { ObjectSchema } from "yup";
export declare type HashMap = {
    [key: string]: HashMap | string | RegExp | boolean | "this" | ObjectSchema;
};
export declare class ValidatorException extends Error {
}
export declare const jsonToSchema: (js: HashMap, line?: number) => yup.ObjectSchema<object & {
    [x: string]: any;
}>;
export declare const yamlToJson: (dataYaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => any;
export declare const yamlToSchema: (yaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => yup.ObjectSchema<object & {
    [x: string]: any;
}>;
export declare const yamlToSchemaWithData: (validationYaml: string, dataYaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => any;
declare const _default: {
    yamlToSchema: (yaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => yup.ObjectSchema<object & {
        [x: string]: any;
    }>;
    jsonToSchema: (js: HashMap, line?: number) => yup.ObjectSchema<object & {
        [x: string]: any;
    }>;
    yamlToJson: (dataYaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => any;
    yamlToSchemaWithData: (validationYaml: string, dataYaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => any;
};
export default _default;
