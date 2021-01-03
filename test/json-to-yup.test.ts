import "mocha";
import { JsonSchema } from "../src/schema";
import { jsonToYup } from "../src/";
import { expect } from "chai";
import { array } from "yup";

const yupYaml: JsonSchema = {
  marketingConsent: {
    type: "boolean",
  },
  abcOrDef: {
    type: "string",
    oneOf: ["abc", "def"],
    required: false,
    nullable: true,
  },
  xyz: {
    type: "string",
    notOneOf: ["abc", "def"],
    required: false,
    nullable: true,
  },
  email: {
    type: "string",
    nullable: true,
    lowercase: true,
    email: "This is not a valid email format",
    when: {
      anyOf: ["marketingConsent"],
      is: true,
      then: {
        type: "string",
        lowercase: true,
        required: "Please supply your email if you want us to market to you",
      },
      otherwise: {
        type: "string",
        notRequired: true,
      },
    },
  },
};

describe(`validate a array of string`, () => {
  it(`must be valid and not numbers`, async () => {
    const VALID_DATA = { names: ["Jack", "John"] };
    const yupYamlString: JsonSchema = {
      names: {
        type: "array",
        of: {
          type: "string",
        },
      },
    };
    const yupYamlNumber: JsonSchema = {
      names: {
        type: "array",
        of: {
          type: "number",
        },
      },
    };
    try {
      jsonToYup(yupYamlString)
        .validate(VALID_DATA)
        .catch((err) => {
          console.error(err);
        });
      jsonToYup(yupYamlNumber)
        .validate(VALID_DATA)
        .catch((err) => {
          // console.error(err.message);
          expect(err.message).equals(
            'names[0] must be a `number` type, but the final value was: `NaN` (cast from the value `"Jack"`).'
          );
        });
    } catch (err) {
      console.error(err);
    }
    expect(jsonToYup(yupYamlString).isValidSync(VALID_DATA)).equals(true);
    expect(jsonToYup(yupYamlNumber).isValidSync(VALID_DATA)).equals(false);
  });
});

describe(`validate a array of objects`, () => {
  it(`must be valid`, async () => {
    const VALID_DATA = { people: [{ name: "Jack", age: 20 }] };
    const yupYamlString: JsonSchema = {
      people: {
        type: "array",
        of: {
          type: "object",
          shape: {
            name: {
              type: "string",
            },
            age: {
              type: "number",
            },
          },
        },
      },
    };
    try {
      // const start = Date.now();
      // for (let x = 0; x < 10000; x++) {
      jsonToYup(yupYamlString)
        .validate(VALID_DATA)
        .catch((err) => {
          console.error(err);
        });
      // }
      // console.log("TIME", Date.now() - start);
    } catch (err) {
      console.error(err);
    }
    expect(jsonToYup(yupYamlString).isValidSync(VALID_DATA)).equals(true);
  });
});

describe(`validate a good email`, () => {
  it(`must be valid in`, async () => {
    const VALID_DATA = { email: "anonymous@email.org" };
    try {
      jsonToYup(yupYaml)
        .validate(VALID_DATA)
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
  });
});

describe(`validate a bad email`, () => {
  it(`this must fail`, async () => {
    const INVALID_DATA = { email: "anonymous" };
    expect(jsonToYup(yupYaml).isValidSync(INVALID_DATA)).equals(false);
    try {
      jsonToYup(yupYaml).validateSync(INVALID_DATA);
    } catch (e) {
      expect(e.message).equals("This is not a valid email format");
    }
  });
});

describe(`don't require an email address if marketingConsent = false`, () => {
  it(`marketingConsent is false and email is missing`, async () => {
    const VALID_DATA = { marketingConsent: false };
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
  });
});

describe(`require an email address if marketingConsent = true`, () => {
  it(`marketingConsent is true, email is missing and failing with error`, async () => {
    const INVALID_DATA = { marketingConsent: true };
    expect(jsonToYup(yupYaml).isValidSync(INVALID_DATA)).equals(false);
    try {
      jsonToYup(yupYaml).validateSync(INVALID_DATA);
      expect.fail("Should've failed");
    } catch (e) {
      expect(e.message).equals(
        "Please supply your email if you want us to market to you"
      );
    }
  });
});

describe(`marketingConsent = true and email in upper case but lowered case`, () => {
  it(`marketingConsent is true and has email in uppercase`, async () => {
    const VALID_DATA = { marketingConsent: true, email: "NOBODY@NOWHERE.COM" };
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
    expect(jsonToYup(yupYaml).validateSync(VALID_DATA).email).equals(
      "nobody@nowhere.com"
    );
  });
});

describe(`oneOf`, () => {
  it(`must be either abc or def`, async () => {
    const VALID_DATA = { abcOrDef: "abc", marketingConsent: false };
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
    VALID_DATA.abcOrDef = "def";
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
    VALID_DATA.abcOrDef = "xyz";
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(false);
  });
});

describe(`notOneOf`, () => {
  it(`must not be either abc or def`, async () => {
    const VALID_DATA = { xyz: "xyz", marketingConsent: false };
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(true);
    VALID_DATA.xyz = "abc";
    expect(jsonToYup(yupYaml).isValidSync(VALID_DATA)).equals(false);
  });
});
