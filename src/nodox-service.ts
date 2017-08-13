import * as Guid from 'guid';
import { INodoxService, ISerializer, IMessageBus, INodoxModule, INodoxDocument, IConnection, INode, IConnector, IOutput, IInput, INodeDefinition } from "../interfaces/core-interfaces";
import { NodoxDocument, Connection, Node, Point, Input, Output } from "./nodox-models";

class IdProvider {
  private static id: number = 0;

  static getId(): number {
    return this.id++;
  }
}

export class NodoxService implements INodoxService {
  constructor(
    private serializer: ISerializer,
    public messageBus: IMessageBus
  ) {
  }
  private getId(): string { return (<any>Guid).raw() }
  private modules: Array<INodoxModule> = new Array<INodoxModule>();
  private acceptingDatatypes = {};

  registerModule(m: INodoxModule) {
    m.definitions.forEach(d => {
      d.nodoxModule = m;
      d.icon = d.icon || "nodox:core_nodox";
      var existingDef = this.find(this.modules, m => m.definitions, def => def.fullName == d.fullName);
      if (existingDef) {
        console.log("duplicate definition: " + d.fullName + ", " + d.nodoxModule.name + ", " + existingDef.nodoxModule.name);
      }
    });
    //TODO check for dependencies
    this.modules.push(m);
  }

  getModules(): Array<INodoxModule> {
    return this.modules;
  }

  getNode(document: INodoxDocument, id: string): INode {
    return document.nodes.find(n => (n.id == id));
  }

  getConnection(document: INodoxDocument, id: string): IConnection {
    return document.connections.find(c => c.id == id);
  }

  getInput(document: INodoxDocument, id: string): IInput {
    var result: IInput;
    document.nodes.find(n => n.inputs.find(i => (result = i).id == id) != null);
    return result;
  }

  getOutput(document: INodoxDocument, id: string): IOutput {
    var result: IOutput;
    document.nodes.find(n => n.outputs.find(o => (result = o).id == id) != null);
    return result;
  }

  indexOfConnector(node: INode, connector: IConnector): number {
    var index = node.inputs.findIndex(c => c.id == connector.id);
    if (index > -1) return index;
    return node.outputs.findIndex(c => c.id == connector.id);
  }

  getNodeFromConnector(document: INodoxDocument, connector: IConnector): INode {
    var result = document.nodes.find(n =>
      n.inputs.findIndex(c => c.id == connector.id) > -1 ||
      n.outputs.findIndex(c => c.id == connector.id) > -1
    )
    return result;
  }

  removeConnection(document: INodoxDocument, connection: IConnection) {
    if (connection == null) return;
    var input = <IInput>connection.inputConnector;

    if (input.connection.id === connection.id) {
      input.connection = null;
    }
    var index = document.connections.indexOf(connection);
    if (index > -1) {
      document.connections.splice(index, 1);
    }
  }

  private find<T, U>(collection: T[], property: (p: T) => U[], predicate: (p: U) => boolean): U {
    for (let item of collection) {
      var found = property(item).find(predicate);
      if (found) return found;
    }
    return null;
  }

  /**
   * set the connectors for nodes and connections of document
   * @param document : INodoxDocument
   * @param modules : INodoxModule[]
   */
  wire(document: INodoxDocument, modules: Array<INodoxModule>) {
    document.cloneFunctions = {};
    this.modules.forEach(m => {
      Object.getOwnPropertyNames(m.cloneFunctions).forEach(cf => {
        if (document.cloneFunctions[cf]) console.warn("duplicate clone function for datatype %o", cf);
        document.cloneFunctions[cf] = m.cloneFunctions[cf];
      });
    });

    // update definition
    document.nodes.forEach(node => {
      node.definition = this.find(modules, m => m.definitions, d => d.fullName.toLowerCase() == node.nodeType.toLowerCase());
      if (!node.definition) {
        console.warn("Node " + node.nodeType + " has no definition");
      }
      // update inputs
      node.inputs.forEach(i => {
        i.definition = node.definition.inputs.find(id => id.name.toLowerCase() == i.name.toLowerCase());
        if (!i.definition) {
          console.warn("Input " + i.name + "(" + i.dataType + ")" + "has no definition");
        }
      });

    });

    document.connections.forEach(connection => {

      //set the outputNodes
      connection.inputNode = document.nodes.find(n => n.id === connection.inputNodeId);
      if (!connection.inputNode) {
        let err = `No inputNode found for connection. inputNodeId=${connection.inputNodeId}`;
        console.log(err);
        throw (err)
      }

      connection.outputNode = document.nodes.find(n => n.id === connection.outputNodeId);
      if (!connection.inputNode) {
        let err = `No outNode found for connection. outputNodeId=${connection.outputNodeId}`;
        console.log(err);
        throw (err)
      }

      var input = connection.inputNode.inputs.find(i => i.id === connection.inputConnectorId);
      if (!input) {
        let err = `No Input found for connection. outputNodeId=${connection.inputConnectorId}`;
        console.log(err);
        throw (err)
      }

      //TODO implement IDisposable pattern: garbage collection will have a problem here
      // Or implement a service.findConnection(connectionId) service.findInput(inputId) pattern
      input.connection = connection;
      connection.inputConnector = input;

      var output = connection.outputNode.outputs.find(i => i.id === connection.outputConnectorId);
      if (!output) {
        let err = `No Output found for connection. outputConnectorId=${connection.outputConnectorId}`;
        console.log(err);
        throw (err)
      }
      connection.outputConnector = output;

    });
  }

  // connect two nodes
  connect(document: INodoxDocument, inputConnector: IInput, outputConnector: IOutput) {

    var oldConnections = document.connections.filter(c => c.inputConnector == inputConnector);

    if (this.canAcceptConnection(outputConnector, inputConnector)) { //this.canAcceptConnection(outputConnector,inputConnector)
      var connection = new Connection();
      connection.id = this.getId();
      connection.documentId = document.id;
      connection.inputConnectorId = inputConnector.id;
      connection.outputConnectorId = outputConnector.id;
      connection.inputNodeId = inputConnector.nodeId;
      connection.outputNodeId = outputConnector.nodeId;

      connection.inputConnector = inputConnector;
      connection.outputConnector = outputConnector;
      connection.inputNode = this.getNode(document, inputConnector.nodeId);
      connection.outputNode = this.getNode(document, outputConnector.nodeId);
      //connection.canvasManager = connection.inputNode.canvasManager;
      inputConnector.connection = connection;
      oldConnections.forEach(oc => {
        this.removeConnection(document, oc)
      });
      document.connections.push(connection);
    }
  }

  createNewDocument(): INodoxDocument {
    var newDoc = new NodoxDocument();
    newDoc.id = this.getId();
    newDoc.name = "New Nodox document";
    return newDoc
  }

  /**
   * Assigns new ids to document, nodes, node inputs, node outputs and connections
   * used for cloning a document
   * @param document 
   */
  reAssignIds(document: INodoxDocument) {
    var newDocumentId = this.getId();
    document.id = newDocumentId;
    document.name += ".cloned";
    var oldNodeIds = {};
    document.nodes.forEach(n => {
      var newId = this.getId();
      oldNodeIds[n.id] = newId;
      n.id = newId;
      n.documentId = newDocumentId;
      n.inputs.forEach(i => i.nodeId == n.id);
      n.outputs.forEach(o => o.nodeId == n.id);
    });
    document.connections.forEach(c => {
      c.id = this.getId();
      c.documentId = newDocumentId;
      c.inputNodeId = oldNodeIds[c.inputNodeId];
      c.outputNodeId = oldNodeIds[c.outputNodeId];
    });
  }

  /**
   * Returns a json string serialized by the serializer
   * @param document 
   */
  getDocumentJson(document: INodoxDocument): string {
    return this.serializer.SerializeDocument(document);
  }

  /**
   * Returns a wired document from a json string;
   * @param s 
   */
  fromJson(s: string): INodoxDocument {
    var document: INodoxDocument;
    if (typeof (s) == 'string') {
      var document = <INodoxDocument>JSON.parse(s);
      this.wire(document,this.modules);
    }
    return document;
  }

  getConnections(document: INodoxDocument): Array<IConnection> {
    return document.connections;
  }

  getNodes(document: INodoxDocument): Array<INode> {
    return document.nodes;
  }

  private doesAccept(incomingType: string, outgoingType: string) {
    //TODO refine using accepts of datatypes in Module
    //for now: always accept "nodox.core.any"
    if (incomingType == "nodox.modules.core.any" || outgoingType == "nodox.modules.core.any") return true;
    if (outgoingType == incomingType) return true;
    return false;
  }

  /**
   * Return true if source and tarhet connector match with respect to dataType
   * @param sourceConnector 
   * @param targetConnector 
   */
  canAcceptConnection(sourceConnector: IConnector, targetConnector: IConnector): boolean {
    if (sourceConnector.connectorType == targetConnector.connectorType) return false;
    if (sourceConnector.nodeId == targetConnector.nodeId) return false;
    if (sourceConnector.dataType == targetConnector.dataType) return true;
    return this.doesAccept(sourceConnector.dataType, targetConnector.dataType);
  }


  /**
   * Adss a new Node to document
   * @param document 
   * @param definition 
   */
  addNode(document: INodoxDocument, definition: INodeDefinition) {

    var node = new Node();
    node.id = this.getId();
    node.name = definition.name;
    node.point = new Point(0, 0);// todo is event point if created from event
    node.nodeType = definition.fullName;
    node.definition = definition;
    node.documentId = document.id;

    //model
    node.inputs = new Array<IInput>();
    definition.inputs.forEach(id => {
      var input = new Input();
      input.id = this.getId();
      input.dataType = id.dataType;
      input.name = id.name;
      input.value = (typeof (id.defaultValue) === "function") ? id.defaultValue() : id.defaultValue;
      input.definition = id;
      //wiring up:
      input.nodeId = node.id;
      node.inputs.push(input);
    });

    node.outputs = new Array<IOutput>();
    definition.outputs.forEach(od => {
      var output = new Output();
      output.dataType = od.dataType;
      output.name = od.name;
      //wiring up:
      output.nodeId = node.id;
      output.id = this.getId();
      node.outputs.push(output);
    });
    node.icon = definition.icon;
    document.nodes.push(node);
  }

  /**
   * Delete a selection of nodes and the connected connections
   * @param document 
   * @param nodes 
   */
  deleteSelection(document: INodoxDocument, nodes: Array<INode>) {
    nodes.forEach(n => this.deleteNode(document, n));
  }

  /**
   * Delete a node and the connected connections
   * @param document 
   * @param node 
   */
  deleteNode(document: INodoxDocument, node: INode): void {
    var connections = document.connections.filter(c => c.inputNodeId == node.id || c.outputNodeId == node.id);
    connections.forEach(c => {
      var p = this.removeConnection(document, c);
    });
    document.nodes.splice(document.nodes.indexOf(node), 1);
  }
}

