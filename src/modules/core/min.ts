import { CORE_MODULE_NAMESPACE, Lookup, NodeProcessingMode, NodoxNodeDefinition, NodoxRunningContext } from '../../types';

const processFunction = (_context: NodoxRunningContext, result: any, inputParams: Lookup<any>, _index:number) => {
  result.min = result.min || [];
  const a = +inputParams.a;
  const b = +inputParams.b;
  result.min.push(Math.min(a, b));
};

export const minDefinition: NodoxNodeDefinition = {
  name: 'Min',
  description: 'the min of two numbers',
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
      description: 'The min of a and b',
      dataType: CORE_MODULE_NAMESPACE + '.number'
    }
  ],
  icon: 'nodox:core_min',
  fullName: CORE_MODULE_NAMESPACE + '.min'
};
