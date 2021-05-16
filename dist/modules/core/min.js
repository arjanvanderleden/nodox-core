"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minDefinition = void 0;
var types_1 = require("../../types");
var processFunction = function (context, result, inputParams, index) {
    result.min = result.min || [];
    var a = +inputParams.a;
    var b = +inputParams.b;
    result.min.push(Math.min(a, b));
};
exports.minDefinition = {
    name: 'Min',
    description: 'the min of two numbers',
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
            description: 'The min of a and b',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number'
        }
    ],
    icon: 'nodox:core_min',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.min'
};
