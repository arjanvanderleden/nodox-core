import { v4 } from 'uuid';
import { Connector, NodoxModule, NodoxNodeDefinition, NodoxService, NodoxDocument, Connection, NodoxNode, InputConnector, OutputConnector } from '.';
import { ConnectorType, InputDefinition, OutputDefinition } from './interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uuidIdProvider = () => v4();

export type IdProvider = () => string;

export const createService: (getId: IdProvider) => NodoxService = (getId) =>  {

  const modules: NodoxModule[] = [];

  const getDefinitionLookup = () => modules.reduce((definitionLookup, module) =>{
    return module.definitions.reduce((lookup , definition) =>{
      lookup[definition.fullName] = definition;
      return lookup;
    }, definitionLookup);
  }, {} as {[key: string]: NodoxNodeDefinition })

  const getDefinition = (fullName: string) => getDefinitionLookup()[fullName];

  const registerModule = (module: NodoxModule) => {
    module.definitions.forEach(definition => {
      definition.icon = definition.icon || "nodox:core_nodox";
      const existingDef = getDefinition(definition.fullName);
      if (existingDef) {
        throw new Error(`duplicate definition (${definition.fullName}): ${module.name} and ${existingDef.moduleName}`);
      }
    });
    const moduleNameSpaces = modules.map(m => m.namespace);
    module.dependencies.forEach(dependency => {
      if (!moduleNameSpaces.includes(dependency)) {
        throw new Error(`Module '${module.namespace}' dependency not met: ${dependency}`)
      }
    })
    modules.push(module);
  }

  const getModules = () => modules;
  const byId = (id: string) => (item: {id:string}) => id === item.id;
  const getNode = (document: NodoxDocument, nodeId: string) => document.nodes.find(byId(nodeId));
  const getConnection = (document: NodoxDocument, connectionId: string) => document.connections.find(byId(connectionId));

  const getInput = (document: NodoxDocument, inputId: string) =>{
    const foundNode = document.nodes.find(node => node.inputs.find(byId(inputId)) !== undefined);
    return {node: foundNode, input: foundNode?.inputs.find(byId(inputId)) };
  }

  const getOutput = (document: NodoxDocument, outputId: string) =>{
    const foundNode = document.nodes.find(node => node.inputs.find(byId(outputId)));
    return {node: foundNode, output: foundNode?.outputs.find(byId(outputId)) };
  }

  const indexOfConnector = (node: NodoxNode, connector: Connector) => {
    const index = node.inputs.findIndex(byId(connector.id));
    return index > -1 ? index : node.outputs.findIndex(byId(connector.id));
  }

  const getNodeFromConnector = (document: NodoxDocument, connector: Connector) => {
    const result = document.nodes.find(n =>
      n.inputs.findIndex(c => c.id == connector.id) > -1 ||
      n.outputs.findIndex(c => c.id == connector.id) > -1
    )
    return result;
  }

  const removeConnection = (document: NodoxDocument, connectionId: string) => {
    const connection = getConnection(document, connectionId);
    if (connection !== undefined) {
      const {input} = getInput(document, connection.inputConnectorId);
      if (input !== undefined) {
        delete input.connectionId;
      }
      const {output} = getOutput(document, connection.outputConnectorId);
      if (output !== undefined) {
        delete output.connectionId;
      }
      const index = document.connections.indexOf(connection);
      if (index > -1) {
        document.connections.splice(index, 1);
      }
    }
  }

  const connect = (document: NodoxDocument, inputConnector: InputConnector, outputConnector: OutputConnector) => {

    const oldConnectionIds = document
      .connections
      .filter(connection => connection.inputConnectorId == inputConnector.id)
      .map(connection => connection.id);

    if (canAcceptConnection(outputConnector, inputConnector)) {
      const connection: Connection = {
        id: getId(),
        inputConnectorId: inputConnector.id,
        outputConnectorId: outputConnector.id,
      }
      inputConnector.connectionId = connection.id;
      oldConnectionIds.forEach(id => {
        removeConnection(document, id)
      });
      document.connections.push(connection);
      return connection;
    } else {
      console.log(`cannot accept, input ${inputConnector.dataType}, output ${outputConnector.dataType}` )
      return undefined;
    }
  }

  const createNewDocument = () => {
    const newDocument: NodoxDocument = {
      id: getId(),
      name: "New Nodox document",
      connections: [],
      nodes: [],
    }
    return newDocument
  }

  /**
   * Assigns new ids to document, nodes, node inputs, node outputs and connections
   * used for cloning a document
   * @param document
   */
  const reAssignIds = (document: NodoxDocument) => {
    document.id = getId();
    document.name += ".cloned";
    const oldConnectorIds: {[key: string]: string} = {};
    document.nodes.forEach(n => {
      const newId = getId();
      oldConnectorIds[n.id] = newId;
      n.id = newId;
      n.inputs.forEach(inputConnector => {
        const newInputId = getId();
        inputConnector.nodeId = n.id,
        oldConnectorIds[inputConnector.id] = newInputId;
        inputConnector.id = newInputId;
      });
      n.outputs.forEach(outputConnector => {
        const newOutputId = getId();
        outputConnector.nodeId = n.id;
        oldConnectorIds[outputConnector.id] = newOutputId;
        outputConnector.id = oldConnectorIds[newOutputId];
      });
    });
    document.connections.forEach(connector => {
      connector.id = getId();
      connector.inputConnectorId = oldConnectorIds[connector.inputConnectorId];
      connector.outputConnectorId = oldConnectorIds[connector.outputConnectorId]
    });
    return document;
  }

  const fromJson = (s: string) => {
    const document: NodoxDocument = <NodoxDocument>JSON.parse(s);
    return document;
  }

  const getConnections = (document: NodoxDocument) => document.connections;

  const getNodes = (document: NodoxDocument) => document.nodes;

  const doesAccept = (incomingType: string, outgoingType: string) => {
    //TODO refine using accepts of datatypes in Module
    //for now: always accept "nodox.core.any"
    if (incomingType == "nodox.modules.core.any" || outgoingType == "nodox.modules.core.any") return true;
    if (outgoingType == incomingType) return true;
    return false;
  }

  const canAcceptConnection = (sourceConnector: Connector, targetConnector: Connector) => {
    if (sourceConnector.connectorType == targetConnector.connectorType) return false;
    if (sourceConnector.nodeId == targetConnector.nodeId) return false;
    if (sourceConnector.dataType == targetConnector.dataType) return true;
    return doesAccept(sourceConnector.dataType, targetConnector.dataType);
  }


  const addNode = (document: NodoxDocument, definition: NodoxNodeDefinition) => {

    const toInputConnector = (nodeId: string) => (inputDefinition: InputDefinition) => ({
      id: getId(),
      nodeId,
      dataType: inputDefinition.dataType,
      name: inputDefinition.name,
      definitionFullName: definition.fullName,
      connectionId: ConnectorType.input
    } as InputConnector)

    const toOutputConnector = (nodeId: string) => (outputDefinition: OutputDefinition) => ({
      id: getId(),
      connectorType: ConnectorType.output,
      dataType: outputDefinition.dataType,
      nodeId
    } as OutputConnector);

    const id = getId();
    const node: NodoxNode = {
      id,
      name: definition.name,
      definitionFullName: definition.fullName,
      inputs: definition.inputs.map(toInputConnector(id)),
      outputs: definition.outputs.map(toOutputConnector(id)),
      icon: definition.icon,
    }
    document.nodes.push(node);
    return node;
  }

  const deleteNodes = (document: NodoxDocument, nodes: Array<NodoxNode>) => {
    nodes.forEach(n => deleteNode(document, n));
  }

  const deleteNode = (document: NodoxDocument, node: NodoxNode) => {
    document.connections.filter(connection =>
      [
        ...node.inputs.map(input => input.connectionId),
        ...node.outputs.map(output => output.connectionId)
      ]
      .includes(connection.id))
      .forEach(connection => {
      removeConnection(document, connection.id);
    });
    document.nodes.splice(document.nodes.indexOf(node), 1);
  }

  return <NodoxService>{
    getConnections,
    getDefinition,
    addNode,
    canAcceptConnection,
    connect,
    createNewDocument,
    deleteNode,
    deleteNodes,
    fromJson,
    getInput,
    getModules,
    getNode,
    getNodeFromConnector,
    getNodes,
    getOutput,
    indexOfConnector,
    reAssignIds,
    registerModule,
    removeConnection
};

}

