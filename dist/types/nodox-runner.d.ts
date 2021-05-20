import { NodoxModule, NodoxNode } from '.';
export interface NodoxRunningContext {
    modules: Array<NodoxModule>;
    usedPromises: unknown;
}
export interface NodoxRunner {
    run: (context: NodoxRunningContext, outputNode: NodoxNode) => Promise<unknown>;
}
