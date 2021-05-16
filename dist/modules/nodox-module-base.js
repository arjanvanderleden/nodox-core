"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodoxModuleBase = void 0;
var NodoxModuleBase = /** @class */ (function () {
    function NodoxModuleBase() {
        this.dependencies = [];
        this.dataTypes = [];
        this.cloneFunctions = {};
    }
    NodoxModuleBase.prototype.merge = function (otherModule) {
        var _this = this;
        otherModule.definitions.forEach(function (newDefinition) {
            if (_this.definitions.find(function (def) { return def.fullName === newDefinition.fullName; })) {
                _this.definitions.push(newDefinition);
            }
            else {
                console.warn('This module %o, already has a definition with fullname %o', _this.name, newDefinition.fullName);
            }
        });
        return this;
    };
    return NodoxModuleBase;
}());
exports.NodoxModuleBase = NodoxModuleBase;
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
