import { Connector, InputConnector, OutputConnector } from './core';
export declare const CORE_MODULE_NAMESPACE = "nodox.module.core";
export * from './core';
export * from './nodox-runner';
export declare type Lookup<T> = {
    [key: string]: T;
};
export declare function isInput(connector: Connector): connector is InputConnector;
export declare function isOutput(connector: Connector): connector is OutputConnector;
export declare type CloneFunction<T> = (item: T) => T;
