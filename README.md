# JSON to YUP

Write your YUP validation as computer-friendly JSON.

    yarn add json-to-yup
    
## Use cases

### Non-technical people writing validation

### Code-safe yup injection


### Example

`Validation JSON`
```json
{
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
```

`Data JSON`
```json
{
  "marketingConsent": true,
  "email": "NOBODY@NOWHERE.COM"
}
```

`Result`
```typescript
import expect;
import jsonToSchema;
const yupYaml = "Validation YAML above";
const VALID_DATA = "Data YAML above";

expect(jsonToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
```

# 
