import {
  CORE_MODULE_NAMESPACE,
  Lookup,
  NodeProcessingMode,
  NodoxNodeDefinition,
  NodoxRunningContext,
} from '../../types';

const processFunction = (
  _context: NodoxRunningContext,
  result: Lookup<any>,
  inputParams: Lookup<any>,
  _index: number
) => {
  result.sum = result.sum || [];
  const a = +inputParams.a;
  const b = +inputParams.b;
  result.sum.push(a + b);
};

export const addDefinition: NodoxNodeDefinition = {
  name: 'Add',
  description: 'adds two numbers',
  processFunction,
  processingMode: NodeProcessingMode.wrap,
  inputs: [
    {
      name: 'a',
      description: 'First number',
      dataType: CORE_MODULE_NAMESPACE + '.number',
      defaultValue: 0,
    },
    {
      name: 'b',
      description: 'Second number',
      dataType: CORE_MODULE_NAMESPACE + '.number',
      defaultValue: 0,
    },
  ],
  outputs: [
    {
      name: 'sum',
      description: 'Sum of a and b',
      dataType: CORE_MODULE_NAMESPACE + '.number',
    },
  ],
  icon: 'nodox:core_nodox',
  fullName: CORE_MODULE_NAMESPACE + '.add',
};
