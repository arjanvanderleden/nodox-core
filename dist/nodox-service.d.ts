import { NodoxService } from '.';
export declare const uuidIdProvider: () => string;
export declare type IdProvider = () => string;
export declare const REASON_IDENTICAL_CONNECTOR_TYPES = "identical connector types";
export declare const REASON_IDENTICAL_PARENT_NODE = "identical parent node";
export declare const REASON_DATATYPE_MISMATCH = "dataTypes do not match";
export declare const REASON_CIRCULAR_DEPENDENCY = "circular dependency";
export declare const create: (getId: IdProvider) => NodoxService;
