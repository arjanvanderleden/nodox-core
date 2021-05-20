import { NodoxModuleBase } from '../../src/modules/nodox-module-base';
import { CORE_MODULE_NAMESPACE, DataType, Lookup, NodeProcessingMode, NodoxNodeDefinition } from '../../src/types';
export class DemoModule extends NodoxModuleBase {
    name: string;
    description: string;
    namespace: string;

    dataTypes: DataType[];
    definitions: NodoxNodeDefinition[];
    cloneFunctions = {};

    constructor () {
      super();
      this.name = 'Mock';
      this.description = 'Mock definitions for Nodox';
      this.namespace = 'nodox.modules.mock';
      this.dependencies = [];
      this.dataTypes = [
        {
          name: 'number',
          description: 'Javascript number',
          accepts: []
        }];
      this.definitions = [
        {
          name: 'identity',
          description: 'returns the same number',
          processFunction: (_context: any, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
            result.b = result.b || [];
            const a = +inputParams.a;
            result.b.push(a);
          },
          processingMode: NodeProcessingMode.wrap,
          inputs: [{
            name: 'a',
            description: 'input number',
            dataType: this.namespace + '.number',
            defaultValue: 0
          }],
          outputs: [{
            name: 'b',
            description: 'The value of input a',
            dataType: this.namespace + '.number'
          }],
          icon: 'nodox:core_nodox',
          fullName: this.namespace + '.identity'
        },
        {
          name: 'to string',
          description: 'creates a string of the input',
          processFunction: (_context: any, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
            result.b = result.b || [];
            const a = String(inputParams.a);
            result.b.push(a);
          },
          processingMode: NodeProcessingMode.wrap,
          inputs: [{
            name: 'a',
            description: 'input ',
            dataType: this.namespace + '.any',
            defaultValue: 0
          }],
          outputs: [{
            name: 'b',
            description: 'The string value of input a',
            dataType: this.namespace + '.string'
          }],
          icon: 'nodox:core_nodox',
          fullName: this.namespace + '.tostring'
        }, {
          name: 'to combined string',
          description: 'creates a combined string of of both input when not empty',
          processFunction: (_context: any, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
            result.c = result.b ?? [];
            const a = String(inputParams.a);
            const b = String(inputParams.b);
            result.c.push([a, b].filter(s => s.length > 1).join(' - '));
          },
          processingMode: NodeProcessingMode.wrap,
          inputs: [{
            name: 'a',
            description: 'input a',
            dataType: this.namespace + '.any',
            defaultValue: ''
          }, {
            name: 'b',
            description: 'input b',
            dataType: this.namespace + '.any',
            defaultValue: ''
          }],
          outputs: [{
            name: 'c',
            description: 'The string value of input a + input b',
            dataType: this.namespace + '.string'
          }],
          icon: 'nodox:core_nodox',
          fullName: this.namespace + '.combinestrings'
        }
      ];
    }
}

export class Demo2Module extends NodoxModuleBase {
  name: string;
  description: string;
  namespace: string;
  definitions: NodoxNodeDefinition[];

  constructor () {
    super();
    this.name = 'Mock2';
    this.description = 'Mock2 definitions for Nodox';
    this.namespace = 'nodox.modules.mock2';
    this.dependencies = ['nodox.modules.mock'];
    this.definitions = [];
  }
}

export class Demo3Module extends NodoxModuleBase {
  name: string;
  description: string;
  namespace: string;
  definitions: NodoxNodeDefinition[];
  dependencies: string[];
  constructor () {
    super();
    this.name = 'Mock2';
    this.description = 'Mock2 definitions for Nodox';
    this.namespace = 'nodox.modules.mock3';
    this.dependencies = [];
    this.definitions = [{
      name: 'to some string',
      description: 'creates some value of type somestring',
      processFunction: (_context: any, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
        result.c = result.b ?? [];
        const a = String(inputParams.a);
        const b = String(inputParams.b);
        result.c.push([a, b].filter(s => s.length > 1).join(' - '));
      },
      processingMode: NodeProcessingMode.wrap,
      inputs: [{
        name: 'a',
        description: 'input a',
        dataType: this.namespace + '.somestring',
        defaultValue: ''
      }, {
        name: 'b',
        description: 'input b',
        dataType: this.namespace + '.somestring',
        defaultValue: ''
      }],
      outputs: [{
        name: 'c',
        description: 'The string value of input a + input b',
        dataType: this.namespace + '.somestring'
      }],
      icon: 'nodox:core_nodox',
      fullName: this.namespace + '.somestring'
    }, {
      name: 'any thing',
      description: 'creates anything',
      processFunction: (_context: any, result: Lookup<any>, inputParams: Lookup<any>, _index:number) => {
        result.c = result.b ?? [];
        const a = String(inputParams.a);
        const b = String(inputParams.b);
        result.c.push([a, b].filter(s => s.length > 1).join(' - '));
      },
      processingMode: NodeProcessingMode.wrap,
      inputs: [{
        name: 'a',
        description: 'input a',
        dataType: CORE_MODULE_NAMESPACE + '.any',
        defaultValue: ''
      }, {
        name: 'b',
        description: 'input b',
        dataType: CORE_MODULE_NAMESPACE + '.any',
        defaultValue: ''
      }],
      outputs: [{
        name: 'c',
        description: 'The any value of input a + input b',
        dataType: CORE_MODULE_NAMESPACE + '.any'
      }],
      icon: 'nodox:core_nodox',
      fullName: this.namespace + '.anything'
    }];
  }
}
