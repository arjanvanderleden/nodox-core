"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestModule = (function () {
    function TestModule() {
        this.cloneFunctions = {};
        this.processAdd = function () { };
        this.processMax = function () { };
        this.name = "test";
        this.description = " a simple module for testing";
        this.namespace = "test";
        this.dependencies = [];
        this.dataTypes = [{
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
            }];
        this.definitions = [
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
        ];
        this.merge = function (a) { return a; },
            this.cloneFunctions = [];
    }
    return TestModule;
}());
exports.TestModule = TestModule;
