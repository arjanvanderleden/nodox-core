import { Connector, ConnectorType, InputConnector, OutputConnector } from './core';

export const CORE_MODULE_NAMESPACE = 'nodox.module.core';

export * from './core';
export * from './nodox-runner';

export type Lookup<T> = { [key: string]: T };

export function isInput(connector: Connector): connector is InputConnector {
  return connector.connectorType === ConnectorType.input;
}

export function isOutput(connector: Connector): connector is OutputConnector {
  return connector.connectorType === ConnectorType.output;
}

export type CloneFunction<T> = (item: T) => T;
