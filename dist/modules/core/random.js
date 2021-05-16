"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDefinition = void 0;
var types_1 = require("../../types");
var processFunction = function (context, result, inputParams, index) {
    if (!result.random) {
        result.random = [];
        var seed = inputParams.seed;
        Math.seedrandom(seed);
    }
    result.random.push(Math.random());
};
exports.randomDefinition = {
    name: 'Random',
    description: 'creates a seeded random number ',
    processFunction: processFunction,
    processingMode: types_1.NodeProcessingMode.stop,
    inputs: [
        {
            name: 'seed',
            description: 'The seed to be used for teh random generator',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.string',
            defaultValue: 'For example: Nodox'
        }
    ],
    outputs: [
        {
            name: 'random',
            description: 'A random number between 0 and 1',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.number'
        }
    ],
    icon: 'nodox:core_nodox',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.random'
};
