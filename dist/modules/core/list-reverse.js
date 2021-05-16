"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReverse = void 0;
var types_1 = require("../../types");
var postprocessReverse = function (context, nodeValues) {
    nodeValues.keyNames.push('count');
    nodeValues.values.count = nodeValues.values.count || [];
    nodeValues.values.item = nodeValues.values.item || [];
    nodeValues.values.item.revers();
    nodeValues.values.count.push(nodeValues.values.item.length);
};
var processFunction = function (context, result, inputParams, index) {
    var _a;
    result.item = (_a = result.item) !== null && _a !== void 0 ? _a : [];
    if (!result.seed) {
        result.seed = [];
        result.seed.push(inputParams.seed);
    }
    ;
    var item = inputParams.item;
    result.item.push(item);
};
var namespace = 'nodox.core';
exports.listReverse = {
    name: 'List reverse',
    description: 'Shuffles a list',
    processFunction: processFunction,
    postprocessFunction: postprocessReverse,
    processingMode: types_1.NodeProcessingMode.wrap,
    inputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: namespace + '.any',
            defaultValue: null
        }
    ],
    outputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: namespace + '.any'
        }
    ],
    icon: 'nodox:list_reverse',
    fullName: namespace + '.reverse'
};
