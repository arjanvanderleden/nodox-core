import { NodoxRunningContext, Lookup } from '../..';
import { CORE_MODULE_NAMESPACE, NodeProcessingMode, NodoxNodeDefinition } from '../../types';

const processFunction = (_context: NodoxRunningContext, result: any, inputParams: Lookup<any>, _index:number) => {
  if (!result.random) {
    result.random = [];
    const seed = inputParams.seed;
    (<any>Math).seedrandom(seed);
  }
  result.random.push(Math.random());
};

export const randomDefinition: NodoxNodeDefinition = {
  name: 'Random',
  description: 'creates a seeded random number ',
  processFunction,
  processingMode: NodeProcessingMode.stop,
  inputs: [
    {
      name: 'seed',
      description: 'The seed to be used for teh random generator',
      dataType: CORE_MODULE_NAMESPACE + '.string',
      defaultValue: 'For example: Nodox'
    }],
  outputs: [
    {
      name: 'random',
      description: 'A random number between 0 and 1',
      dataType: CORE_MODULE_NAMESPACE + '.number'
    }
  ],
  icon: 'nodox:core_nodox',
  fullName: CORE_MODULE_NAMESPACE + '.random'
};
