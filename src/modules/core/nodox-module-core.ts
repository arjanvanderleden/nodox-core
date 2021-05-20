import { addDefinition } from './add';
import { randomDefinition } from './random';
import { maxDefinition } from './max';
import { minDefinition } from './min';
import { listReverse } from './list-reverse';
import { listShuffleDefinition } from './list-shuffle';
import { listSortDefinition } from './list-sort';

import { CORE_MODULE_NAMESPACE, NodoxNodeDefinition } from '../../types';
import { NodoxModuleBase } from '../nodox-module-base';

export class Core extends NodoxModuleBase {
  name: string;
  description: string;
  namespace: string;
  definitions: NodoxNodeDefinition[];
  constructor() {
    super();
    this.name = 'Core';
    this.description = 'Core definitions for Nodox';
    this.namespace = CORE_MODULE_NAMESPACE;
    this.dependencies = [];
    this.dataTypes = [
      {
        name: 'number',
        description: 'Javascript number',
        accepts: [],
      },
      {
        name: 'string',
        description: 'Javascript string',
        accepts: ['*'],
      },
      {
        name: 'boolean',
        description: 'boolean',
        accepts: ['*'],
      },
      {
        name: 'any',
        description: 'Anything',
        accepts: ['*'],
      },
    ];
    this.definitions = [
      addDefinition,
      randomDefinition,
      maxDefinition,
      minDefinition,
      listSortDefinition,
      listShuffleDefinition,
      listReverse,
    ];
  }
}
