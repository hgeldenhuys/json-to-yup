import {expect} from "chai";
import "mocha";
import {jsonToSchema} from "../dist";

const yupYaml = {
    "marketingConsent": {
        "boolean": true
    },
    "email": {
        "string": {
            "nullable": true,
            "lowercase": true,
            "email": "This is not a valid email format",
            "when": {
                "this": "marketingConsent",
                "is": true,
                "then": {
                    "string": {
                        "lowercase": true,
                        "required": "Please supply your email if you want us to market to you"
                    }
                },
                "otherwise": {
                    "string": {
                        "notRequired": true
                    }
                }
            }
        }
    }
}

describe(`validate a good email`, () => {
    it(`must be valid in`, async () => {
        const VALID_DATA = {email: "anonymous@email.org"};
        expect(jsonToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
    });
});

describe(`validate a bad email`, () => {
    it(`this must fail`, async () => {
        const INVALID_DATA = {email: "anonymous"};
        expect(jsonToSchema(yupYaml).isValidSync(INVALID_DATA)).equals(false);
        try {
            jsonToSchema(yupYaml).validateSync(INVALID_DATA);
        } catch (e) {
            expect(e.message).equals("This is not a valid email format");
        }
    });
});

describe(`don't require an email address if marketingConsent = false`, () => {
    it(`marketingConsent is false but email is missing`, async () => {
        const VALID_DATA = {marketingConsent: false};
        expect(jsonToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
    });
});

describe(`require an email address if marketingConsent = true`, () => {
    it(`marketingConsent is true but email is missing`, async () => {
        const INVALID_DATA = {marketingConsent: true};
        expect(jsonToSchema(yupYaml).isValidSync(INVALID_DATA)).equals(false);
        try {
            jsonToSchema(yupYaml).validateSync(INVALID_DATA);
        } catch (e) {
            expect(e.message).equals("Please supply your email if you want us to market to you");
        }
    });
});

describe(`marketingConsent = true and email in upper case but lowered case`, () => {
    it(`marketingConsent is true and has email in uppercase`, async () => {
        const VALID_DATA = {marketingConsent: true, email: "NOBODY@NOWHERE.COM"};
        expect(jsonToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
        expect(jsonToSchema(yupYaml).validateSync(VALID_DATA).email).equals("nobody@nowhere.com");
    });
});

