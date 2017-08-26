import {INodoxModule,IDataType,INodeDefinition} from '../dist';

export class TestModule implements INodoxModule{
    name: string;
    description: string;
    namespace: string;
    dependencies: string[];
    dataTypes: IDataType[];
    definitions: Array<INodeDefinition>;
    cloneFunctions = {};
    merge: (INodoxModule)=>INodoxModule;
  

    constructor(){
        this.name = "test";
        this.description = " a simple module for testing";
        this.namespace = "test";
        this.dependencies = [];
        this.dataTypes = [{
            name: "number",
            description: "Javascript number",
            accepts: []
        },
        {
            name: "string",
            description: "Javascript string",
            accepts: ["*"]
        },
        {
            name: "boolean",
            description: "boolean",
            accepts: ["*"]
        },
        {
            name: "any",
            description: "Anything",
            accepts: ["*"]
        }];
        this.definitions = [
            <any>{
                name: "Add",
                description: "adds two numbers",
                processFunction: this.processAdd,
                inputs: [
                    {
                        name: "a",
                        description: "First number",
                        dataType: this.namespace + ".number",
                        defaultValue: 0
                    },
                    {
                        name: "b",
                        description: "Second number",
                        dataType: this.namespace + ".number",
                        defaultValue: 0
                    }
                ],
                outputs: [
                    {
                        name: "sum",
                        description: "Sum of a and b",
                        dataType: this.namespace + ".number"
                    }
                ],
                icon: "nodox:core_nodox",
                fullName: this.namespace + ".add"
            }, {
                name: "Max",
                description: "the max of two numbers",
                processFunction: this.processMax,
                inputs: [
                    {
                        name: "a",
                        description: "First number",
                        dataType: this.namespace + ".number",
                        defaultValue: 0
                    },
                    {
                        name: "b",
                        description: "Second number",
                        dataType: this.namespace + ".number",
                        defaultValue: 0
                    }
                ],
                outputs: [
                    {
                        name: "max",
                        description: "The max of a and b",
                        dataType: this.namespace + ".number"
                    }
                ],
                icon: "nodox:core_max",
                fullName: this.namespace + ".max"
            }
        ];
        this.merge =  (a:INodoxModule) => a,
        this.cloneFunctions =  []
    
    }

    processAdd= ()=>{};
    processMax= ()=>{};
}