import { INodoxService, INodoxModule, INodoxDocument, IConnection, INode, IConnector, IOutput, IInput, INodeDefinition } from "./interfaces/core-interfaces";
export declare class NodoxService implements INodoxService {
    constructor();
    private getId();
    private modules;
    private acceptingDatatypes;
    private serializer;
    registerModule(m: INodoxModule): void;
    getModules(): Array<INodoxModule>;
    getNode(document: INodoxDocument, id: string): INode;
    getConnection(document: INodoxDocument, id: string): IConnection;
    getInput(document: INodoxDocument, id: string): IInput;
    getOutput(document: INodoxDocument, id: string): IOutput;
    indexOfConnector(node: INode, connector: IConnector): number;
    getNodeFromConnector(document: INodoxDocument, connector: IConnector): INode;
    removeConnection(document: INodoxDocument, connection: IConnection): void;
    private find<T, U>(collection, property, predicate);
    /**
     * set the connectors for nodes and connections of document
     * @param document : INodoxDocument
     * @param modules : INodoxModule[]
     */
    wire(document: INodoxDocument, modules: Array<INodoxModule>): void;
    connect(document: INodoxDocument, inputConnector: IInput, outputConnector: IOutput): void;
    createNewDocument(): INodoxDocument;
    /**
     * Assigns new ids to document, nodes, node inputs, node outputs and connections
     * used for cloning a document
     * @param document
     */
    reAssignIds(document: INodoxDocument): void;
    /**
     * Returns a json string serialized by the serializer
     * @param document
     */
    getDocumentJson(document: INodoxDocument): string;
    /**
     * Returns a wired document from a json string;
     * @param s
     */
    fromJson(s: string): INodoxDocument;
    getConnections(document: INodoxDocument): Array<IConnection>;
    getNodes(document: INodoxDocument): Array<INode>;
    private doesAccept(incomingType, outgoingType);
    /**
     * Return true if source and tarhet connector match with respect to dataType
     * @param sourceConnector
     * @param targetConnector
     */
    canAcceptConnection(sourceConnector: IConnector, targetConnector: IConnector): boolean;
    /**
     * Adss a new Node to document
     * @param document
     * @param definition
     */
    addNode(document: INodoxDocument, definition: INodeDefinition): INode;
    /**
     * Delete a selection of nodes and the connected connections
     * @param document
     * @param nodes
     */
    deleteSelection(document: INodoxDocument, nodes: Array<INode>): void;
    /**
     * Delete a node and the connected connections
     * @param document
     * @param node
     */
    deleteNode(document: INodoxDocument, node: INode): void;
}
