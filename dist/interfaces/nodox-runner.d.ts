import { NodoxModule, NodoxNode } from ".";
export interface NodoxRunner {
    run: (context: NodoxRunningContext, outputNode: NodoxNode) => Promise<any>;
}
export interface NodoxRunningContext {
    modules: Array<NodoxModule>;
    usedPromises: Object;
}
