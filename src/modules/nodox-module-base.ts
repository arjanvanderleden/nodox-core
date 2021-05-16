import { NodoxModule, NodoxNodeDefinition, DataType, Lookup } from '../types';
export abstract class NodoxModuleBase implements NodoxModule {
  abstract name: string;
  abstract description: string;
  abstract namespace: string;
  dependencies: string[] = [];
  dataTypes: DataType[] = [];
  abstract definitions: NodoxNodeDefinition[];
  cloneFunctions: Lookup<any> = {};

  merge (otherModule: NodoxModule): NodoxModule {
    otherModule.definitions.forEach((newDefinition: NodoxNodeDefinition) => {
      if (this.definitions.find(def => def.fullName === newDefinition.fullName)) {
        this.definitions.push(newDefinition);
      } else {
        console.warn('This module %o, already has a definition with fullname %o', this.name, newDefinition.fullName);
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
    this.namespace = "nodox.modules.XXX";
    this.dependencies = [
      "nodox.modules.core",
      "nodox.modules.Calc"];
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
            dataType: "nodox.modules.core.number",
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
        icon: "nodox:XXX",
        fullName: this.namespace + ".XXX"
      }
    ];
  }
*/
