"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShuffleDefinition = void 0;
var types_1 = require("../../types");
var postprocessFunction = function (context, nodeValues) {
    nodeValues.keyNames.push('count');
    nodeValues.values.count = nodeValues.values.count || [];
    nodeValues.values.item = nodeValues.values.item || [];
    var seed = nodeValues.values.seed[0];
    // Fisher-Yates Shuffle
    // http://stackoverflow.com/a/6274398/2965537
    // http://bost.ocks.org/mike/shuffle/
    var shuffle = function (seed, array) {
        Math.seedrandom(seed);
        var counter = array.length;
        var temp;
        var index;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    };
    shuffle(seed, nodeValues.values.item);
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
exports.listShuffleDefinition = {
    name: 'List shuffle',
    description: 'Shuffles a list',
    processFunction: processFunction,
    processingMode: types_1.NodeProcessingMode.wrap,
    postprocessFunction: postprocessFunction,
    inputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.any',
            defaultValue: null
        },
        // this would be a good candidate for a "no-connector" input ....
        {
            name: 'seed',
            description: 'Seed for pseudo random generator',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.string',
            defaultValue: 'for example: Nodox'
        }
    ],
    outputs: [
        {
            name: 'item',
            description: 'Item in the list',
            dataType: types_1.CORE_MODULE_NAMESPACE + '.any'
        }
    ],
    icon: 'nodox:list_shuffle',
    fullName: types_1.CORE_MODULE_NAMESPACE + '.shuffle'
};
