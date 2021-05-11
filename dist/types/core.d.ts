import { Lookup } from '.';
import { NodoxRunningContext } from './nodox-runner';
export declare enum ConnectorType {
    input = "input",
    output = "output"
}
export declare class InputExhaustedError extends Error {
}
/**
 * defines what a node should do during processing
 * when one the input has not enough values to provide
 * for the values if onother input
 * possible values are:
 * - wrap: start using values from the start (the output length is the length of the longest input)
 * - addEmpty: use value undefined (the output length is the length of the longest input)
 * - stop: stop processing values (the output length is the length of the shortest input)
 * - throw: throw InputExhaustedError (processing is aborted by an exception)
 */
export declare enum NodeProcessingMode {
    wrap = "wrap",
    addEmpty = "add-empty",
    stop = "stop",
    throw = "throw"
}
export interface NodoxService {
    registerModule(module: NodoxModule): void;
    getModules(): Array<NodoxModule>;
    getDefinition(fullname: string): NodoxNodeDefinition;
    getNodes(document: NodoxDocument): Array<NodoxNode>;
    getConnections(document: NodoxDocument): Array<Connection>;
    createNewDocument<T>(metaData?: T): NodoxDocument<T>;
    reAssignIds(document: NodoxDocument): NodoxDocument;
    fromJson(s: string): NodoxDocument;
    /**
     * Connects and inputConnector with an outputConnector
     * @param document
     * @param inputConnector
     * @param outputConnector
     */
    connect(document: NodoxDocument, firstConnector: Connector, secondConnector: Connector): Connection | undefined;
    /**
     * Return true if source and target connector match with respect to dataType
     * @param sourceConnector
     * @param targetConnector
     */
    canAcceptConnection(sourceConnector: Connector, targetConnector: Connector): boolean;
    /**
     * returns the index in the collection of inputs or outputs
     * can be used for redering nodes
     * @param node NodoxNode
     * @param connector Connector
     */
    indexOfConnector(node: NodoxNode, connector: Connector): number;
    getNodeFromConnector(document: NodoxDocument, connector: Connector): NodoxNode | undefined;
    /**
     *
     * @param document
     * @param id id of connector
     * @returns {connector: the connector, node: the node this connector belongs to }
     */
    getConnector(document: NodoxDocument, id: string): {
        connector?: Connector;
        node?: NodoxNode;
    };
    /**
     *
     * @param document
     * @param id id of connector
     * @returns {connector: the input connector, node: the node this connector belongs to }
     */
    getInput(document: NodoxDocument, id: string): {
        connector?: Connector;
        node?: NodoxNode;
    };
    /**
     *
     * @param document
     * @param id id of connector
     * @returns {connector: the output connector, node: the node this connector belongs to }
     */
    getOutput(document: NodoxDocument, id: string): {
        connector?: Connector;
        node?: NodoxNode;
    };
    getNode(document: NodoxDocument, id: string): NodoxNode | undefined;
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
/**
 * The connection between two nodes connecting the inputConnector of one node
 * to the outputConnector of another node
 */
export interface Connection {
    id: string;
    inputConnectorId: string;
    outputConnectorId: string;
}
/**
 * A
 */
export interface Connector {
    id: string;
    name: string;
    label: string;
    dataType: string;
    connectorType: ConnectorType;
    connectionId?: string;
    nodeId: string;
}
/**
 * A Connector of type output that can connect to a Connector of type input
 */
export interface OutputConnector extends Connector {
    connectorType: ConnectorType.output;
}
/**
 * A Connector of type input that can connect to a Connector of type output
 */
export interface InputConnector extends Connector {
    connectorType: ConnectorType.input;
    value?: unknown;
    definitionFullName: string;
}
/**
 * An element in the document that holds inputs that provide input data
 * to generate new data that will be presented through outputs of the node
 */
export interface NodoxNode {
    id: string;
    name: string;
    definitionFullName: string;
    inputs: InputConnector[];
    outputs: OutputConnector[];
    icon: string;
}
/**
 * A collections of nodes and their connections
 * T type of medtadata
 */
export interface NodoxDocument<T = never | any> {
    id: string;
    name: string;
    description?: string;
    metaData?: T;
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
export interface NodeValues {
    keyNames: Array<string>;
    inputLengths: unknown;
    maxLength: number;
    minLength: number;
    values: unknown;
}
export declare type ProcessFunction = (context: NodoxRunningContext, result: Lookup<any>, inputParams: unknown, index: number) => void;
export declare type PreprocessFunction = (context: NodoxRunningContext) => void;
export declare type PostprocessFunction = (context: NodoxRunningContext, result: NodeValues) => void;
