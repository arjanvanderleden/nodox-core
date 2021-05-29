import { v4 } from 'uuid';
import {
  Connector,
  NodoxModule,
  NodoxNodeDefinition,
  NodoxService,
  NodoxDocument,
  Connection,
  NodoxNode,
  InputConnector,
  OutputConnector,
} from '.';
import {
  CloneFunction,
  ConnectorType,
  CORE_MODULE_NAMESPACE,
  InputDefinition,
  Lookup,
  OutputDefinition,
} from './types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uuidIdProvider = () => v4();

export type IdProvider = () => string;

export const REASON_IDENTICAL_CONNECTOR_TYPES = 'identical connector types';
export const REASON_IDENTICAL_PARENT_NODE = 'identical parent node';
export const REASON_DATATYPE_MISMATCH = 'dataTypes do not match';
export const REASON_CIRCULAR_DEPENDENCY = 'circular dependency';

export const create: (getId: IdProvider) => NodoxService = getId => {
  const modules: NodoxModule[] = [];

  const getDefinitionLookup = () =>
    modules.reduce((definitionLookup, module) => {
      return module.definitions.reduce((lookup, definition) => {
        lookup[definition.fullName] = definition;
        return lookup;
      }, definitionLookup);
    }, {} as { [key: string]: NodoxNodeDefinition });

  const getDefinition = (fullName: string) => getDefinitionLookup()[fullName];

  const registerModule = (module: NodoxModule) => {
    module.definitions.forEach(definition => {
      definition.icon = definition.icon || 'nodox:core_nodox';
      const existingDef = getDefinition(definition.fullName);
      if (existingDef) {
        throw new Error(`duplicate definition (${definition.fullName}): ${module.name}`);
      }
    });
    const moduleNameSpaces = modules.map(m => m.namespace);
    module.dependencies.forEach(dependency => {
      if (!moduleNameSpaces.includes(dependency)) {
        throw new Error(`Module '${module.namespace}' dependency not met: ${dependency}`);
      }
    });
    modules.push(module);
  };

  const getModules = () => modules;
  const byId = (id: string) => (item: { id: string }) => id === item.id;
  const getNode = (document: NodoxDocument, nodeId: string) => document.nodes.find(byId(nodeId));
  const getConnection = (document: NodoxDocument, connectionId: string) =>
    document.connections.find(byId(connectionId));

  const getUpstreamNodeIds = (document: NodoxDocument, nodeId: string) => {
    const toUpstreamNodeIds = (list: string[], input: InputConnector) => {
      const { outputNodeId } = getConnection(document, input.connectionId!)!;
      const result: string[] = [...list, outputNodeId, ...getUpstreamNodeIds(document, outputNodeId)];
      return result;
    };

    const hasConnection = (input: InputConnector) => input.connectionId !== undefined;
    const node = getNode(document, nodeId);
    return node === undefined ? [] : node.inputs.filter(hasConnection).reduce(toUpstreamNodeIds, []);
  };

  const getInput = (document: NodoxDocument, inputId: string) => {
    const node = document.nodes.find(node => node.inputs.find(byId(inputId)) !== undefined);
    return { node, connector: node?.inputs.find(byId(inputId)) };
  };

  const getOutput = (document: NodoxDocument, outputId: string) => {
    const node = document.nodes.find(node => node.outputs.find(byId(outputId)) !== undefined);
    return { node, connector: node?.outputs.find(byId(outputId)) };
  };

  const getConnector = (document: NodoxDocument, id: string) => {
    const { node, connector } = getInput(document, id);
    return connector !== undefined ? { node, connector } : getOutput(document, id);
  };

  const indexOfConnector = (node: NodoxNode, connector: Connector) => {
    const index = node.inputs.findIndex(byId(connector.id));
    return index > -1 ? index : node.outputs.findIndex(byId(connector.id));
  };

  const getNodeFromConnector = (document: NodoxDocument, connector: Connector) => {
    const node = getNode(document, connector.nodeId);
    return node;
  };

  const removeConnection = (document: NodoxDocument, connectionId: string) => {
    const connection = getConnection(document, connectionId);
    if (connection !== undefined) {
      const { connector: input } = getInput(document, connection.inputConnectorId);
      if (input !== undefined) {
        delete input.connectionId;
      }
      const index = document.connections.indexOf(connection);
      document.connections.splice(index, 1);
    }
  };

  const connectorPair = (firstConnector: Connector, secondConnector: Connector) => {
    if (firstConnector.connectorType === secondConnector.connectorType) {
      return {};
    }
    const [inputConnector, outputConnector] =
      firstConnector.connectorType === ConnectorType.input
        ? ([firstConnector, secondConnector] as [InputConnector, OutputConnector])
        : ([secondConnector, firstConnector] as [InputConnector, OutputConnector]);
    return { inputConnector, outputConnector };
  };

  const doesAcceptDataType = (inputType: string, outputType: string) => {
    const inputPathSegments = inputType.split('.').reverse();
    const outputPathSegments = outputType.split('.').reverse();
    const lastPathIsAny = inputPathSegments[0] === 'any' || outputPathSegments[0] === 'any';
    const restPathsAreEqual = inputPathSegments.slice(1).join('.') === outputPathSegments.slice(1).join('.');

    switch (true) {
      case inputType === `${CORE_MODULE_NAMESPACE}.any` || outputType === `${CORE_MODULE_NAMESPACE}.any`:
        return true;
      case outputType === inputType:
        return true;
      case lastPathIsAny && restPathsAreEqual:
        return true;
      default:
        return false;
    }
  };

  const canAcceptConnection = (document: NodoxDocument, firstConnector: Connector, secondConnector: Connector) => {
    const { inputConnector: input, outputConnector: output } = connectorPair(firstConnector, secondConnector);
    switch (true) {
      case input === undefined || output === undefined:
        return { canConnect: false, reason: REASON_IDENTICAL_CONNECTOR_TYPES };
      case input!.nodeId === output!.nodeId:
        return { canConnect: false, reason: REASON_IDENTICAL_PARENT_NODE };
      case !doesAcceptDataType(input!.dataType, output!.dataType):
        return { canConnect: false, reason: REASON_DATATYPE_MISMATCH };
      case getUpstreamNodeIds(document, output!.nodeId).includes(input!.nodeId):
        return { canConnect: false, reason: REASON_CIRCULAR_DEPENDENCY };
    }
    return { canConnect: true };
  };

  const connect = (document: NodoxDocument, firstConnector: Connector, secondConnector: Connector) => {
    const { inputConnector: input, outputConnector: output } = connectorPair(firstConnector, secondConnector);
    if (input !== undefined && output !== undefined) {
      const { canConnect } = canAcceptConnection(document, input, output);
      if (!canConnect) {
        return undefined;
      }

      const currentInputConnections = document.connections
        .filter(connection => connection.inputConnectorId === input.id)
        .map(connection => connection.id);

      const connection: Connection = {
        id: getId(),
        inputConnectorId: input.id,
        outputConnectorId: output.id,
        inputNodeId: input.nodeId,
        outputNodeId: output.nodeId,
      };

      currentInputConnections.forEach(id => {
        removeConnection(document, id);
      });
      input.connectionId = connection.id;
      document.connections.push(connection);
      return connection;
    }
    return undefined;
  };

  const createNewDocument = <T>(metaData?: T) => {
    const newDocument: NodoxDocument = {
      id: getId(),
      name: 'New Nodox document',
      connections: [],
      nodes: [],
      metaData,
    };
    return newDocument;
  };

  /**
   * Assigns new ids to document, nodes, node inputs, node outputs and connections
   * used for cloning a document
   * @param document
   */
  const cloneDocument = (document: NodoxDocument) => {
    const newDocument = createNewDocument();

    const toNewIds = (lookup: Lookup<string>, item: { id: string }) => {
      lookup[item.id] = getId();
      return lookup;
    };

    const toNewConnectorIds = (nodeId:string) => (lookup: Lookup<string>, item: { id: string }) => {
      lookup[item.id] = item.id.replace(nodeId, lookup[nodeId]);
      return lookup;
    };

    const newIds: Lookup<string> = { [document.id]: getId() };
    document.nodes.reduce(toNewIds, newIds);
    document.nodes.forEach(node => {
      node.inputs.reduce(toNewConnectorIds(node.id), newIds);
      node.outputs.reduce(toNewConnectorIds(node.id), newIds);
    });
    document.connections.reduce(toNewIds, newIds);

    const toNewInput: CloneFunction<InputConnector> = input => {
      const id = newIds[input.id];
      return {
        ...input,
        id,
        nodeId: newIds[input.nodeId],
      };
    };

    const toNewOutput: CloneFunction<OutputConnector> = output => {
      const id = newIds[output.id];
      return {
        ...output,
        id,
        nodeId: newIds[output.nodeId],
      } as OutputConnector;
    };

    const toNewConnection = (connection: Connection) => {
      const id = newIds[connection.id];
      return {
        ...connection,
        id,
        inputConnectorId: newIds[connection.inputConnectorId],
        inputNodeId: newIds[connection.inputNodeId],
        outputConnectorId: newIds[connection.outputConnectorId],
        outputNodeId: newIds[connection.outputNodeId],
      } as Connection;
    };

    const toNewNode = (node: NodoxNode) => {
      const id = newIds[node.id];
      return {
        ...node,
        id,
        inputs: node.inputs.map(toNewInput),
        outputs: node.outputs.map(toNewOutput),
      };
    };
    const result = {
      ...document,
      ...newDocument,
      name: `${document.name}.cloned`,
      nodes: document.nodes.map(toNewNode),
      connections: document.connections.map(toNewConnection),
    };
    return result;
  };

  const fromJson = (s: string) => {
    const document: NodoxDocument = JSON.parse(s) as NodoxDocument;
    return document;
  };

  const getConnections = (document: NodoxDocument) => document.connections;

  const getNodes = (document: NodoxDocument) => document.nodes;

  const addNode = (document: NodoxDocument, definition: NodoxNodeDefinition) => {
    const toInputConnector = (nodeId: string) => (inputDefinition: InputDefinition, index: number) =>
      {
        const connector : InputConnector = {
        id: `in:${index}:${nodeId}`,
        nodeId,
        dataType: inputDefinition.dataType,
        name: inputDefinition.name,
        label: inputDefinition.label,
        description: inputDefinition.description,
        definitionFullName: definition.fullName,
        connectorType: ConnectorType.input,
        connectionId: undefined,
        value: inputDefinition.defaultValue,
      };
    return connector;
  };

    const toOutputConnector = (nodeId: string) => (outputDefinition: OutputDefinition, index: number) =>
      {
        const connector: OutputConnector = {
        id: `out:${index}:${nodeId}`,
        connectorType: ConnectorType.output,
        dataType: outputDefinition.dataType,
        name: outputDefinition.name,
        label: outputDefinition.label,
        description: outputDefinition.description,
        nodeId,
        };
        return connector;
      };

    const id = getId();
    const node: NodoxNode = {
      id,
      name: definition.name,
      definitionFullName: definition.fullName,
      inputs: definition.inputs.map(toInputConnector(id)),
      outputs: definition.outputs.map(toOutputConnector(id)),
      icon: definition.icon,
    };
    document.nodes.push(node);
    return node;
  };

  const deleteNodes = (document: NodoxDocument, nodes: Array<NodoxNode>) => {
    nodes.forEach(node => deleteNode(document, node));
  };

  const deleteNode = (document: NodoxDocument, node: NodoxNode) => {
    const isConnectedToNode = (connection: Connection) =>
      connection.inputNodeId === node.id || connection.outputNodeId === node.id;

    const remove = (connection: Connection) => removeConnection(document, connection.id);

    document.connections.filter(isConnectedToNode).forEach(remove);
    document.nodes.splice(document.nodes.indexOf(node), 1);
  };

  const getConnectedNode = (document: NodoxDocument, connector: Connector) => {
    const connection = document.connections.find(connection => {
      return connection.inputConnectorId === connector.id ||
      connection.outputConnectorId === connector.id;
    });
    if (connection === undefined) {
      return undefined;
    }
    const node = document.nodes
      .filter(node => node.id !== connector.nodeId)
      .find(node => node.id === connection.inputNodeId || node.id === connection.outputNodeId);
    return node;
  };

  const service: NodoxService = {
    getConnections,
    getDefinition,
    addNode,
    canAcceptConnection,
    connect,
    createNewDocument,
    deleteNode,
    deleteNodes,
    fromJson,
    getConnector,
    getInput,
    getModules,
    getNode,
    getNodeFromConnector,
    getConnectedNode,
    getNodes,
    getOutput,
    indexOfConnector,
    cloneDocument,
    registerModule,
    removeConnection,
  };
  return service;
};
