import { Lookup, NodoxModule,NodeValues, OutputConnector  } from '.';

export interface NodoxRunningContext {
  modules: NodoxModule[];
  cache: Lookup<NodeValues>
}

export interface NodoxRunner {
  run: (context: NodoxRunningContext, outputConnector: OutputConnector) => Promise<unknown>;
}
