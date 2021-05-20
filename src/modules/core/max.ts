import { CORE_MODULE_NAMESPACE, Lookup, NodeProcessingMode, NodoxNodeDefinition, NodoxRunningContext } from '../../types';

const processFunction = (_context: NodoxRunningContext, result: any, inputParams: Lookup<any>, _index:number) => {
  result.max = result.max || [];
  const a = +inputParams.a;
  const b = +inputParams.b;
  result.max.push(Math.max(a, b));
};

export const maxDefinition: NodoxNodeDefinition = {
  name: 'Max',
  description: 'the max of two numbers',
  processFunction,
  processingMode: NodeProcessingMode.wrap,
  inputs: [
    {
      name: 'a',
      description: 'First number',
      dataType: CORE_MODULE_NAMESPACE + '.number',
      defaultValue: 0
    },
    {
      name: 'b',
      description: 'Second number',
      dataType: CORE_MODULE_NAMESPACE + '.number',
      defaultValue: 0
    }
  ],
  outputs: [
    {
      name: 'max',
      description: 'The max of a and b',
      dataType: CORE_MODULE_NAMESPACE + '.number'
    }
  ],
  icon: 'nodox:core_max',
  fullName: CORE_MODULE_NAMESPACE + '.max'
};
