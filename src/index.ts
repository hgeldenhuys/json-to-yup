import * as yup from "yup";
import {ObjectSchema, Schema} from "yup";

const yupMap: {[key: string]: () => any} = {
    string: yup.string,
    number: yup.number,
    boolean: yup.boolean,
    array: yup.array,
    mixed: yup.mixed,
    date: yup.date,
};

export type HashMap = {[key: string]: HashMap | string | number | RegExp | boolean | ObjectSchema};

export class ValidatorException extends Error {}

/**Generates a single validation node, like required
 * ToDo: Document
 * */
const generateSingleValidator = (
    {line, validations, validationName, schema, dataType, attributeName}:
        {
            line: number,
            validations: HashMap,
            validationName: string,
            schema: any,
            dataType: string,
            attributeName: string
        }) => {
    line ++;
    const validation = validations[validationName];
    const hasParams = typeof validation === "object" && !Array.isArray(validation);

    const call = schema[validationName] as any;
    if (!call) {
        throw new ValidatorException(`Could not find validation {${validationName}} on ${dataType}`);
    }

    if (validationName === "when") {
        const inspect = validation as any;
        if ((inspect.this === undefined) && (inspect.these === undefined))
            throw new ValidatorException(`Expecting either {this} or {these} when working with when(), line ${line} for ${attributeName}`);
        line++
        if (inspect.this && inspect.these)
            throw new ValidatorException(`Can only specify one of either {this} or {these} when working with when(), line ${line} for ${attributeName}`);
        if (inspect.this && (typeof inspect.this !== "string"))
            throw new ValidatorException(`When using {this} I expect a single string value, line ${line} for ${attributeName}`);
        if (inspect.these && (typeof inspect.these !== "object") && (!Array.isArray(inspect.these)))
            throw new ValidatorException(`When using {these} I expect an array of strings, line ${line} for ${attributeName}`);
        line++
        const whenData: HashMap = {
            is: inspect.is
        };
        const thenDataType = Object.keys(inspect.then)[0];
        const otherwiseDataType = Object.keys(inspect.otherwise)[0];
        const thenAttribute = inspect.then[thenDataType];
        const otherwiseAttribute = inspect.otherwise[otherwiseDataType];
        if (inspect.then) whenData.then = createSchema({
            validations: thenAttribute,
            dataType: thenDataType,
            line,
            attributeName,
            attribute: thenAttribute
        });
        if (inspect.otherwise) whenData.otherwise = createSchema({
            validations: otherwiseAttribute,
            dataType: otherwiseDataType,
            line,
            attributeName,
            attribute: otherwiseAttribute
        });
        return schema.when(inspect.this || inspect.these, whenData);
    } else {
        if (hasParams && validation) {
            const params = (!hasParams ? {} : validation) as HashMap;
            if (validationName === "matches") {
                params.value = new RegExp(params["value"] as any, params.flags as any);
            }
            if (params.value) {
                return call.apply(schema, [params.value, params.message]);
            } else if (params.message) {
                return call.apply(schema, [params.message]);
            } else {
                return call.apply(schema);
            }
        } else if (!hasParams) {
            if (validation === true) {
                return call.apply(schema)
            } else if (validation === false) {
            } else {
                return call.apply(schema, [validation])
            }
        }
    }
};

const createSchema = (
    {line, dataType, attribute, attributeName, validations}:
        {line: number, dataType: string, attribute: HashMap, attributeName: string, validations: HashMap}
)=> {
    line ++;
    if ((dataType === "object") || (!yupMap[dataType])) {
        return jsonToSchema(attribute);
    } else {
        let schema = yupMap[dataType]();
        if (validations) Object.keys(validations)
            .forEach((validationName: string) => {
                line ++;
                schema = generateSingleValidator({
                    attributeName,
                    schema,
                    dataType,
                    validationName,
                    line,
                    validations
                })
            });
        return schema;
    }
};

const jsonToSchema_ = (js: HashMap, line = 2) => {
    let validator: {[key: string]: Schema<object>} = {};
    Object.keys(js)
        .forEach(attributeName => {
            line ++;
            const attribute = js[attributeName] as HashMap;
            Object.keys(attribute)
                .forEach((dataType: string) => {
                    const validations = attribute[dataType] as HashMap;
                    validator[attributeName] = createSchema({
                        validations,
                        dataType,
                        line,
                        attributeName,
                        attribute
                    });
                });
        });
    return yup.object().shape(validator);
};

const jsonToSchema = (js: HashMap) => {
    return jsonToSchema_(js)
};

export default {
    jsonToSchema
}

