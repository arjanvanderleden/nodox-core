import { NodoxService } from '.';
export declare const uuidIdProvider: () => string;
export declare type IdProvider = () => string;
export declare const createService: (getId: IdProvider) => NodoxService;
