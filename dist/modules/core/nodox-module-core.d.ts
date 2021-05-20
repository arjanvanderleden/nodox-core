import { NodoxNodeDefinition } from '../../types';
import { NodoxModuleBase } from '../nodox-module-base';
export declare class Core extends NodoxModuleBase {
    name: string;
    description: string;
    namespace: string;
    definitions: NodoxNodeDefinition[];
    constructor();
}
