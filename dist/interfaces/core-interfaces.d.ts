/* eslint-disable no-unused-vars */
import { NodoxRunningContext } from './nodox-runner'
export declare enum ConnectorType {
    input = 'input',
    output = 'output'
}
export declare enum NodeProcessingMode {
    wrap = 'wrap',
    addNull = 'add-null',
    stop = 'stop'
}
export interface NodoxService {
    registerModule(module: NodoxModule): void;
    getModules(): Array<NodoxModule>;
    getDefinition(fullname: string): NodoxNodeDefinition;
    getNodes(document: NodoxDocument): Array<NodoxNode>;
    getConnections(document: NodoxDocument): Array<Connection>;
    createNewDocument(): NodoxDocument;
    reAssignIds(document: NodoxDocument): NodoxDocument;
    fromJson(s: string): NodoxDocument;
    /**
     * Connects and inputConnector with an outputConnector
     * @param document
     * @param inputConnector
     * @param outputConnector
     */
    connect(document: NodoxDocument, inputConnector: InputConnector, outputConnector: OutputConnector): Connection;
    /**
     * Return true if source and target connector match with respect to dataType
     * @param sourceConnector
     * @param targetConnector
     */
    canAcceptConnection(sourceConnector: Connector, targetConnector: Connector): boolean;
    indexOfConnector(node: NodoxNode, connector: Connector): number;
    getNodeFromConnector(document: NodoxDocument, connector: Connector): NodoxNode;
    /**
     *
     * @param document
     * @param id id of connector
     * @returns {connector: the connector, node: the node this connector belongs to }
     */
    getInput(document: NodoxDocument, id: string): {
        connector?: Connector;
        node?: NodoxNode;
    };
    /**
     *
     * @param document
     * @param id id of connector
     * @returns {connector: the connector, node: the node this connector belongs to }
     */
    getOutput(document: NodoxDocument, id: string): {
        connector?: Connector;
        node?: NodoxNode;
    };
    getNode(document: NodoxDocument, id: string): NodoxNode;
    /**
     * adds an unconnected NodoxNode to the document
     * @param document
     * @param definition
     * @returns the node
     */
    addNode(document: NodoxDocument, definition: NodoxNodeDefinition): NodoxNode;
    /**
     * Deletes an array of nodes from a document
     * @param document
     * @param nodes
     */
    deleteNodes(document: NodoxDocument, nodes: Array<NodoxNode>): void;
    /**
     * removes a node and all related connections from a document
     * @param document
     * @param node
     */
    deleteNode(document: NodoxDocument, node: NodoxNode): void;
    /**
    * Removes a connection and it's references from the document,
    * @param document
    * @param connection
    * @returns void
    */
    removeConnection(document: NodoxDocument, Id: string): void;
}
export interface Connection {
    id: string;
    inputConnectorId: string;
    outputConnectorId: string;
}
export interface Connector {
    id: string;
    name: string;
    label: string;
    dataType: string;
    connectorType: ConnectorType;
    connectionId?: string;
    nodeId: string;
}
export interface OutputConnector extends Connector {
    connectorType: ConnectorType.output;
}
export interface InputConnector extends Connector {
    connectorType: ConnectorType.input;
    value?: unknown;
    definitionFullName: string;
}
export interface NodoxNode {
    id: string;
    name: string;
    definitionFullName: string;
    inputs: InputConnector[];
    outputs: OutputConnector[];
    icon: string;
}
export interface NodoxDocument {
    id: string;
    name: string;
    description?: string;
    nodes: Array<NodoxNode>;
    connections: Array<Connection>;
    author?: string;
    authorEmail?: string;
}
export interface DataType {
    name: string;
    description: string;
    accepts: Array<string>;
}
export declare type CloneFunction<T> = (objectToClone: T) => T;
export interface NodoxNodeDefinition {
    name: string;
    fullName: string;
    moduleName: string;
    description: string;
    processFunction: ProcessFunction;
    inputs: Array<InputDefinition>;
    outputs: Array<OutputDefinition>;
    icon: string;
    preprocessFunction: PreprocessFunction;
    postprocessFunction: PostprocessFunction;
    processingMode: NodeProcessingMode;
}
export interface NodoxModule {
    name: string;
    description: string;
    namespace: string;
    dependencies: string[];
    dataTypes: DataType[];
    definitions: NodoxNodeDefinition[];
}
export interface InputDefinition {
    name: string;
    dataType: string;
    description?: string;
    defaultValue?: unknown;
    editorType?: string;
    valueOptions?: Array<unknown>;
}
export interface OutputDefinition {
    name: string;
    description: string;
    dataType: string;
}
export interface INodeValues {
    keyNames: Array<string>;
    inputLengths: unknown;
    maxLength: number;
    minLength: number;
    values: unknown;
}
export interface ProcessFunction {
    (context: NodoxRunningContext, result: INodeValues, inputParams: unknown, index: number): void;
}
export interface PreprocessFunction {
    (context: NodoxRunningContext): void;
}
export interface PostprocessFunction {
    (context: NodoxRunningContext, result: INodeValues): void;
}
