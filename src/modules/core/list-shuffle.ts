import { NodoxRunningContext, Lookup } from '../..';
import { CORE_MODULE_NAMESPACE, NodeProcessingMode, NodoxNodeDefinition } from '../../types';

const postprocessFunction = (_context: NodoxRunningContext, nodeValues: Lookup<any>) => {
  nodeValues.keyNames.push('count');
  nodeValues.values.count = nodeValues.values.count || [];
  nodeValues.values.item = nodeValues.values.item || [];
  const seed = nodeValues.values.seed[0];

  // Fisher-Yates Shuffle
  // http://stackoverflow.com/a/6274398/2965537
  // http://bost.ocks.org/mike/shuffle/

  const shuffle = (seed: string, array: Array<any>) => {
    (Math as any).seedrandom(seed);
    let counter = array.length;
    let temp;
    let index;
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

const processFunction = (
  _context: NodoxRunningContext,
  result: Lookup<any>,
  inputParams: Lookup<any>,
  _index: number
) => {
  result.item = result.item ?? [];
  if (!result.seed) {
    result.seed = [];
    result.seed.push(inputParams.seed);
  }
  const item = inputParams.item;
  result.item.push(item);
};

export const listShuffleDefinition: NodoxNodeDefinition = {
  name: 'List shuffle',
  description: 'Shuffles a list',
  processFunction,
  processingMode: NodeProcessingMode.wrap,
  postprocessFunction,
  inputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: CORE_MODULE_NAMESPACE + '.any',
      defaultValue: null,
    },
    // this would be a good candidate for a "no-connector" input ....
    {
      name: 'seed',
      description: 'Seed for pseudo random generator',
      dataType: CORE_MODULE_NAMESPACE + '.string',
      defaultValue: 'for example: Nodox',
    },
  ],
  outputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: CORE_MODULE_NAMESPACE + '.any',
    },
  ],
  fullName: CORE_MODULE_NAMESPACE + '.shuffle',
};
