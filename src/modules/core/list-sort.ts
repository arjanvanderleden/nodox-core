import { NodoxRunningContext } from '../..';
import { CORE_MODULE_NAMESPACE, Lookup, NodeProcessingMode, NodoxNodeDefinition } from '../../types';

const postprocessFunction = (_context: NodoxRunningContext, nodeValues: Lookup<any>) => {
  nodeValues.keyNames.push('count');
  nodeValues.values.count = nodeValues.values.count || [];
  nodeValues.values.item = nodeValues.values.item || [];
  nodeValues.values.item.sort();
  nodeValues.values.count.push(nodeValues.values.item.length);
};

const processFunction = (_context: NodoxRunningContext, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
  result.item = result.item ?? [];
  if (!result.seed) {
    result.seed = [];
    result.seed.push(inputParams.seed);
  };
  const item = inputParams.item;
  result.item.push(item);
};

export const listSortDefinition: NodoxNodeDefinition = {
  name: 'List sort',
  description: 'Sorts a list',
  processFunction,
  postprocessFunction,
  processingMode: NodeProcessingMode.wrap,
  inputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: CORE_MODULE_NAMESPACE + '.any',
      defaultValue: null
    },
    {
      name: 'sort property',
      description: 'Optional property on wich to sort',
      dataType: CORE_MODULE_NAMESPACE + '.string',
      defaultValue: null
    }
  ],
  outputs: [
    {
      name: 'item',
      description: 'Item in the list',
      dataType: CORE_MODULE_NAMESPACE + '.any'
    }
  ],
  icon: 'nodox:list_sort',
  fullName: CORE_MODULE_NAMESPACE + '.sort'
};
