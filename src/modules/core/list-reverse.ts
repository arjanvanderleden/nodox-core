import { Lookup, NodeProcessingMode, NodoxNodeDefinition, NodoxRunningContext } from '../../types';

const postprocessReverse = (_context: NodoxRunningContext, nodeValues: Lookup<any>) => {
  nodeValues.keyNames.push('count');
  nodeValues.values.count = nodeValues.values.count || [];
  nodeValues.values.item = nodeValues.values.item || [];
  nodeValues.values.item.revers();
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

const namespace = 'nodox.core';

export const listReverse: NodoxNodeDefinition = {
  name: 'List reverse',
  description: 'Shuffles a list',
  processFunction,
  postprocessFunction: postprocessReverse,
  processingMode: NodeProcessingMode.wrap,
  inputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: namespace + '.any',
      defaultValue: null,
    },
  ],
  outputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: namespace + '.any',
    },
  ],
  icon: 'nodox:list_reverse',
  fullName: namespace + '.reverse',
};
