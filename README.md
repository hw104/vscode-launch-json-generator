# launch-json-generator README

The json generator for `launch.json` and `taksk.json`.

## How to use

1. Add item to `inputs` field in `launch.json` or `tasks.json` like this. ([more info for `inputs`](https://code.visualstudio.com/docs/editor/variables-reference#_input-variables)).
   ```jsonc
   {
      "id": "getConfigJson",
      "type": "command",
      "command": "launch-json-generator.generate",
      // specify json scheme you want
      "args": {
        "stringValue": "string",
        "optionalStringValue": "string|null",
        "bool": "boolean",
        "withOption": "'a'|'b'|'c'",
        "nest": {
            "array": ["boolean", "number", ]
        }
      },
   }
   ```
1. use variable `${input:<input-id>}` in `configurations` or `tasks` items like this.
   ```jsonc
   {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\app.js",
      "args": [
        "--json-config=${input:getConfigJson}" // This!
      ]
   }
   ```