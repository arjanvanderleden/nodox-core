export var testModule = {
    name: "test",
    description: " a simple module for testing",
    namespace: "test",
    dependencies: [],
    dataTypes: [{
        name: "number",
        description: "Javascript number",
        accepts: []
    },
    {
        name: "string",
        description: "Javascript string",
        accepts: ["*"]
    },
    {
        name: "boolean",
        description: "boolean",
        accepts: ["*"]
    },
    {
        name: "any",
        description: "Anything",
        accepts: ["*"]
    }],
    definitions: [
        {
            name: "Add",
            description: "adds two numbers",
            processFunction: this.processAdd,
            inputs: [
                {
                    name: "a",
                    description: "First number",
                    dataType: this.namespace + ".number",
                    defaultValue: 0
                },
                {
                    name: "b",
                    description: "Second number",
                    dataType: this.namespace + ".number",
                    defaultValue: 0
                }
            ],
            outputs: [
                {
                    name: "sum",
                    description: "Sum of a and b",
                    dataType: this.namespace + ".number"
                }
            ],
            icon: "nodox:core_nodox",
            fullName: this.namespace + ".add"
        }, {
            name: "Max",
            description: "the max of two numbers",
            processFunction: this.processMax,
            inputs: [
                {
                    name: "a",
                    description: "First number",
                    dataType: this.namespace + ".number",
                    defaultValue: 0
                },
                {
                    name: "b",
                    description: "Second number",
                    dataType: this.namespace + ".number",
                    defaultValue: 0
                }
            ],
            outputs: [
                {
                    name: "max",
                    description: "The max of a and b",
                    dataType: this.namespace + ".number"
                }
            ],
            icon: "nodox:core_max",
            fullName: this.namespace + ".max"
        }
    ],
    merge: (a) => a,
    cloneFunctions: []
}