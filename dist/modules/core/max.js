"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxDefinition = void 0;
var types_1 = require("../../types");
var processFunction = function (context, result, inputParams, index) {
    result.max = result.max || [];
    var a = +inputParams.a;
    var b = +inputParams.b;
    result.max.push(Math.max(a, b));
};
exports.maxDefinition = {
    name: 'Max',
    description: 'the max of two numbers',
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
            name: 'max',
            description: 'The max of a and b',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number'
        }
    ],
    icon: 'nodox:core_max',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.max'
};
