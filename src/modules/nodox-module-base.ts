import { NodoxModule, NodoxNodeDefinition, DataType, Lookup } from '../types';
export abstract class NodoxModuleBase implements NodoxModule {
  abstract name: string;
  abstract description: string;
  abstract namespace: string;
  dependencies: string[] = [];
  dataTypes: DataType[] = [];
  abstract definitions: NodoxNodeDefinition[];
  cloneFunctions: Lookup<any> = {};

  merge(otherModule: NodoxModule): NodoxModule {
    otherModule.definitions.forEach((newDefinition: NodoxNodeDefinition) => {
      if (this.definitions.find(def => def.fullName === newDefinition.fullName)) {
        console.warn(`This module ${this.name}, already has a definition with fullname ${newDefinition.fullName}`);
      } else {
        this.definitions.push(newDefinition);
      }
    });
    return this;
  }
}

/*
export class XXX extends NodoxModule {
  constructor() {
    super();
    this.name = "XXX";
    this.description = "<description>";
    this.namespace = "nodox.module.XXX";
    this.dependencies = [
      "nodox.module.core",
      "nodox.module.Calc"];
    this.dataTypes = <DataType[]>[
      {
        name: "dtXXX",
        description: "<description>",
        accepts: []
      }
    ];
    this.definitions = <NodoxNodeDefinition[]>[
      {
        name: "deXXX",
        description: "<description>",
        processFunction: ()=>{},
        preprocessFunction: (context: IRunningContext) => {},
        postprocessFunction: (context: IRunningContext) => {},
        inputs: <Array<InputDefinition>>[
          {
            name: "inputXXX",
            description: "<description>",
            dataType: "nodox.module.core.number",
            defaultValue: 0
          }
        ],
        outputs: <Array<OutputDefinition>>[
          {
            name: "outputXXX",
            description: "<description>",
            dataType: this.namespace + ".dtXXX"
          }
        ],
        fullName: this.namespace + ".XXX"
      }
    ];
  }
*/
