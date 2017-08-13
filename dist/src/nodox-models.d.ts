import { IPoint, INode, IInput, IOutput, INodeDefinition, ConnectorType, IConnection, INodoxDocument, IInputDescriptor } from '../interfaces/core-interfaces';
/**
    @class Node
*/
export declare class Node implements INode {
    private dirty;
    private processResult;
    private inputParams;
    isDirty(): boolean;
    icon: string;
    documentId: any;
    string: any;
    id: string;
    point: IPoint;
    name: string;
    nodeType: string;
    inputs: Array<IInput>;
    outputs: Array<IOutput>;
    definition: INodeDefinition;
    isSelected: boolean;
    merge(n: INode): INode;
}
export declare class NodeValues {
    keyNames: Array<string>;
    inputLengths: any;
    maxLength: number;
    minLength: number;
    values: any;
}
export declare class ConnectorValue {
    connectorName: string;
    dataType: string;
    values: Array<any>;
}
export declare class Output implements IOutput {
    connectorType: ConnectorType;
    id: string;
    nodeId: string;
    name: string;
    dataType: string;
    label: string;
    index: number;
    connections: IConnection[];
    isInput(): boolean;
    merge(o: IOutput): IOutput;
}
export declare class Input implements IInput {
    id: string;
    nodeId: string;
    connectorType: ConnectorType;
    isInput(): boolean;
    name: string;
    dataType: string;
    label: string;
    value: any;
    index: number;
    connection: IConnection;
    inputChanged: (name: string, value) => void;
    definition: IInputDescriptor;
    merge(i: IInput): Input;
}
export declare class Connection implements IConnection {
    id: string;
    documentId: string;
    inputNodeId: string;
    outputNodeId: string;
    outputConnectorId: string;
    inputConnectorId: string;
    inputNode: INode;
    outputNode: INode;
    outputConnector: IOutput;
    inputConnector: IInput;
    inputPoint: IPoint;
    outputPoint: IPoint;
    merge(c: IConnection): IConnection;
}
export declare class NodoxDocument implements INodoxDocument {
    id: string;
    name: string;
    description: string;
    nodes: INode[];
    connections: IConnection[];
    resultNodeId: string;
    author: string;
    authorEmail: string;
    cloneFunctions: {};
    merge(p: INodoxDocument): INodoxDocument;
    constructor();
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(p: IPoint): Point;
    snapTo(gridX: number, gridY: number): Point;
    scale(factor: number): Point;
    scaleRelativeTo(point: IPoint, factor: number): Point;
    subtract(p: IPoint): Point;
}
