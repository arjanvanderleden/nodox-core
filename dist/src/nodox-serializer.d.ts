import { ISerializer, INodoxDocument } from "../interfaces/core-interfaces";
export declare class Serializer implements ISerializer {
    SerializeDocument(document: INodoxDocument): string;
}
