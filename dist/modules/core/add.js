"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDefinition = void 0;
var types_1 = require("../../types");
var processFunction = function (context, result, inputParams, index) {
    result.sum = result.sum || [];
    var a = +inputParams.a;
    var b = +inputParams.b;
    result.sum.push(a + b);
};
exports.addDefinition = {
    name: 'Add',
    description: 'adds two numbers',
    processFunction: processFunction,
    processingMode: types_1.NodeProcessingMode.wrap,
    inputs: [
        {
            name: 'a',
            description: 'First number',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number',
            defaultValue: 0
        },
        {
            name: 'b',
            description: 'Second number',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number',
            defaultValue: 0
        }
    ],
    outputs: [
        {
            name: 'sum',
            description: 'Sum of a and b',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number'
        }
    ],
    icon: 'nodox:core_nodox',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.add'
};
