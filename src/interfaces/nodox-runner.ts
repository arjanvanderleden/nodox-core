import { NodoxModule, NodoxNode } from ".";

export interface NodoxRunner {
    run: (context: NodoxRunningContext, outputNode: NodoxNode) => Promise<unknown>;
}

export interface NodoxRunningContext {
    modules: Array<NodoxModule>;
    usedPromises: unknown;
}