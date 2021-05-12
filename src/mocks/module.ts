import { Lookup } from '../types';
export class DemoModule {
    name: string;
    description: string;
    namespace: string;
    dependencies: string[];
    dataTypes: any[];
    definitions: any[];
    cloneFunctions = {};

    constructor () {
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
          processFunction: (context: any, result: Lookup<any>, inputParams: Lookup<any>, index:number) => {
            result.b = result.b || [];
            const a = +inputParams.a;
            result.b.push(a);
          },
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
          processFunction: (context: any, result: Lookup<any>, inputParams: Lookup<any>, index:number) => {
            result.b = result.b || [];
            const a = String(inputParams.a);
            result.b.push(a);
          },
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
        }];
    }
}
