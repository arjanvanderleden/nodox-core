
export enum ConnectorType { Input, Output }

export enum NodeProcessingMode {
    Wrap = 0,
    AddNull = 1,
    Stop = 2
}

export interface ISerializer {
    SerializeDocument(document: INodoxDocument): string;
}

export interface IMessageBus {
    subscribe(topic: string, callback: Function);
    unSubscribe(topic: string, callback: Function);
    publish(topic: string, ...args: Array<any>)
}

export interface INodoxService {

    messageBus: IMessageBus;
    registerModule(module: INodoxModule);
    getModules(): Array<INodoxModule>;

    getNodes(document: INodoxDocument): Array<INode>;
    getConnections(document: INodoxDocument): Array<IConnection>;
    createNewDocument(): INodoxDocument;

    reAssignIds(document: INodoxDocument);

    getDocumentJson(document: INodoxDocument): string;
    fromJson(s: string): INodoxDocument;

    connect(document: INodoxDocument, inputConnector: IInput, outputConnector: IOutput);
    canAcceptConnection(sourceConnector: IConnector, targetConnector: IConnector): boolean;
    indexOfConnector(node: INode, connector: IConnector): number;
    getNodeFromConnector(document: INodoxDocument, connector: IConnector): INode;
    getInput(document: INodoxDocument, id: string): IConnector;
    getOutput(document: INodoxDocument, id: string): IConnector;

    getNode(document: INodoxDocument, id: string): INode;
    addNode(document: INodoxDocument, definition: INodeDefinition);

    deleteSelection(document: INodoxDocument, nodes: Array<INode>);
    deleteNode(document: INodoxDocument, node: INode): void;
    removeConnection(document: INodoxDocument, connection: IConnection);
}

export interface IUserInteractionService {
    confirm(question: string, title: string): Promise<boolean>;
    alert(question: string, title: string): Promise<boolean>;
    chooseOne(options: Array<Object>): Promise<Object>;
    chooseSome(options: Array<Object>): Promise<Object[]>;
    notify(text: string);
}




export interface IConnector {
    //storage
    nodeId: string;
    id: string;
    name: string;
    label: string;
    dataType: string;
    connectorType: ConnectorType;

    //model
    isInput(): boolean;

    //canvas
    index: number;
}

export interface IOutput extends IConnector {
    merge(output: IOutput): IOutput;
}

export interface IInput extends IConnector {
    inputChanged: (name: string, value: any) => void;
    value: any;
    connection: IConnection;
    definition: IInputDescriptor;
    merge(input: IInput): IInput;
}

export interface INode {
    //storage
    id: string;
    name: string;
    point: IPoint;
    nodeType: string;
    documentId: string;
    icon: string;
    //model
    definition: INodeDefinition;
    inputs: Array<IInput>;
    outputs: Array<IOutput>;
    //canvas
    //canvasManager: ICanvasManager;
    // to be called when this node is selected
    //onSelected: (selected: boolean) => void;
    // not persisted
    isSelected: boolean;
    merge(source: INode): INode;
}

export interface INodoxDocument {
    id: string;
    name: string;
    description: string;
    nodes: Array<INode>;
    connections: Array<IConnection>;
    resultNodeId: string;
    author: string;
    authorEmail: string;
    cloneFunctions: any;
    merge(program: INodoxDocument): INodoxDocument;
}

export interface IConnection {
    //storage
    id: string;
    documentId: string;
    inputNodeId: string;
    inputConnectorId: string;
    outputNodeId: string;
    outputConnectorId: string;

    //model
    outputNode: INode;
    outputConnector: IOutput;
    inputNode: INode;
    inputConnector: IInput;

    //canvas
    //canvasManager: ICanvasManager;
    inputPoint: IPoint;
    outputPoint: IPoint;

    merge(connection: IConnection): IConnection;
}

export interface IPoint {
    //model
    x: number;
    y: number;
    add(p: IPoint): IPoint;
    snapTo(gridX: number, gridY: number): IPoint;
    scale(factor: number): IPoint;
    scaleRelativeTo(point: IPoint, factor: number): IPoint;
    subtract(p: IPoint): IPoint;
}



export interface IDataType {
    name: string;
    description: string;
    accepts: Array<string>;
}



export interface ICloneFunction<T> {
    (objectToClone: T): T;
}

export interface INodeDefinition {
    name: string;
    fullName: string;
    description: string;
    processFunction: IProcessFunction;
    inputs: Array<IInputDescriptor>;
    outputs: Array<IOutputDescriptor>;
    icon: string;
    nodoxModule: INodoxModule;
    preprocessFunction: IPreprocessFunction;
    postprocessFunction: IPostprocessFunction;
    processingMode: NodeProcessingMode;

}

export interface INodoxModule {
    name: string;
    description: string;
    namespace: string;
    dependencies: Array<string>;
    dataTypes: Array<IDataType>;
    definitions: Array<INodeDefinition>;
    merge(otherModule: INodoxModule): INodoxModule;
    cloneFunctions: any;
}

export interface IInputDescriptor {
    name: string;
    dataType: string;
    description?: string;
    label?: string;
    defaultValue?: any;
    editorType?: string;
    valueOptions?: Array<any>
}

export interface IOutputDescriptor {
    name: string;
    description: string;
    dataType: string;
}

export interface INodeDatabaseService {
    getDocuments(): Promise<INodoxDocument[]>;
    getDocument(documentId: string): Promise<INodoxDocument>;

    updateNode(node: INode): Promise<INode>;
    addNode(node: INode): Promise<INode>;
    deleteNode(node: INode): Promise<boolean>;

    updateConnection(connection: IConnection): Promise<IConnection>;
    addConnection(connection: IConnection): Promise<IConnection>;
    deleteConnection(connection: IConnection): Promise<boolean>;

    addDocument(document: INodoxDocument): Promise<INodoxDocument>;
    updateDocument(document: INodoxDocument): Promise<INodoxDocument>;
    deleteDocument(id: string): Promise<boolean>;
}


export interface INodoxRunner {
    run: (context: IRunningContext, outputNode: INode) => Promise<INodeValues>;
}

export interface IRunningContext {
    modules: Array<INodoxModule>;
    usedPromises: Object;
}

export interface INodeValues {
    keyNames: Array<string>;
    inputLengths: any;
    maxLength: number;
    minLength: number;
    values: any;
}

export interface IProcessFunction {
    (context: IRunningContext, result: INodeValues, inputParams: Object, index: number): void;
}

export interface IPreprocessFunction {
    (context: IRunningContext): void;
}

export interface IPostprocessFunction {
    (context: IRunningContext, result: INodeValues): void;
}

