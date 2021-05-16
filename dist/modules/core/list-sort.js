"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSortDefinition = void 0;
var types_1 = require("../../types");
var postprocessFunction = function (context, nodeValues) {
    nodeValues.keyNames.push('count');
    nodeValues.values.count = nodeValues.values.count || [];
    nodeValues.values.item = nodeValues.values.item || [];
    nodeValues.values.item.sort();
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
exports.listSortDefinition = {
    name: 'List sort',
    description: 'Sorts a list',
    processFunction: processFunction,
    postprocessFunction: postprocessFunction,
    processingMode: types_1.NodeProcessingMode.wrap,
    inputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.any',
            defaultValue: null
        },
        {
            name: 'sort property',
            description: 'Optional property on wich to sort',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.string',
            defaultValue: null
        }
    ],
    outputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.any'
        }
    ],
    icon: 'nodox:list_sort',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.sort'
};
