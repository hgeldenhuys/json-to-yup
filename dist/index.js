"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
const yupMap = {
    string: yup.string,
    number: yup.number,
    boolean: yup.boolean,
    array: yup.array,
    mixed: yup.mixed,
    date: yup.date,
    object: yup.object,
};
const yupSchema = (attribute) => {
    let yupFn = yupMap[attribute.type]();
    Object.keys(attribute).forEach((property) => {
        const value = attribute[property];
        switch (property) {
            case "type": {
                break;
            }
            case "when": {
                const when = attribute[property];
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
                    if (value)
                        yupFn = yupFn[property]();
                }
                else if (value && value.message) {
                    yupFn[property](value.value, value.message);
                }
                else {
                    yupFn = yupFn[property](value);
                }
            }
        }
    });
    return yupFn;
};
exports.jsonToYup = (js) => {
    const fields = {};
    Object.keys(js).forEach((attributeName) => {
        const attribute = js[attributeName];
        fields[attributeName] = yupSchema(attribute);
    });
    return yup.object().shape(fields);
};
exports.default = {
    jsonToYup: exports.jsonToYup,
};
//# sourceMappingURL=index.js.map