import { NodoxModule, NodoxNodeDefinition, DataType, Lookup } from '../types';
export declare abstract class NodoxModuleBase implements NodoxModule {
    abstract name: string;
    abstract description: string;
    abstract namespace: string;
    dependencies: string[];
    dataTypes: DataType[];
    abstract definitions: NodoxNodeDefinition[];
    cloneFunctions: Lookup<any>;
    merge(otherModule: NodoxModule): NodoxModule;
}
