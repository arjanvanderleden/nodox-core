import {
  create,
  REASON_CIRCULAR_DEPENDENCY,
  REASON_DATATYPE_MISMATCH,
  REASON_IDENTICAL_CONNECTOR_TYPES,
  REASON_IDENTICAL_PARENT_NODE,
  uuidIdProvider,
} from '../src/nodox-service';
import { Demo2Module, Demo3Module, DemoModule } from './mocks/module';
import { ConnectorType, CORE_MODULE_NAMESPACE, InputConnector, isInput, isOutput, OutputConnector } from '../src/types';

describe('NodoxService: createNewDocument', () => {
  it('creates a new document', () => {
    const service = create(uuidIdProvider);
    const metaData = { x: 'y' };
    const document = service.createNewDocument(metaData);

    expect(document).toBeDefined();
    expect(document.id).toBeDefined();
    expect(Array.isArray(document.connections)).toBe(true);
    expect(document.connections.length).toBe(0);
    expect(Array.isArray(document.nodes)).toBe(true);
    expect(document.nodes.length).toBe(0);
    expect(document.metaData).toBeDefined();
    expect(document.metaData!.x).toBe('y');
  });

  it('creates a new document', () => {
    const service = create(uuidIdProvider);
    const document = service.createNewDocument();
    expect(document).toBeDefined();
    expect(document.metaData).toBeUndefined();
  });
});

describe('NodoxService: registerModule', () => {
  it('should register a module', () => {
    const module = new DemoModule();
    const service = create(uuidIdProvider);
    expect(service.getModules().length).toBe(0);
    service.registerModule(module);
    expect(service.getModules().length).toBe(1);
  });

  it('should throw if module dependencies are not met', () => {
    const module = new Demo2Module();
    const service = create(uuidIdProvider);
    expect(service.getModules().length).toBe(0);
    expect(() => service.registerModule(module)).toThrow();
  });

  it('should throw if duplicate definitions are registered', () => {
    const module = new DemoModule();
    const service = create(uuidIdProvider);
    service.registerModule(module);
    expect(service.getModules().length).toBe(1);
    expect(() => service.registerModule(module)).toThrow();
  });
});

describe('NodoxService: getDefinition', () => {
  const service = create(uuidIdProvider);
  service.registerModule(new DemoModule());

  it(' should return a registerd definition', () => {
    const definition = service.getDefinition('nodox.module.mock.identity');
    expect(definition).toBeDefined();
    expect(definition.fullName).toBe('nodox.module.mock.identity');
    expect(definition.inputs[0].name).toBe('a');
  });

  it('should return undefined for not registered definitions', () => {
    const definition = service.getDefinition('does-not-exist');
    expect(definition).toBeUndefined();
  });
});

describe('NodoxService: addNode', () => {
  const service = create(uuidIdProvider);
  const module = new DemoModule();
  service.registerModule(module);
  const definition = service.getDefinition('nodox.module.mock.identity');
  const document = service.createNewDocument();

  it('should create a node', () => {
    const node = service.addNode(document, definition);
    const nodes = service.getNodes(document);
    expect(nodes.length).toBe(1);
    expect(node).toEqual(nodes[0]);
    expect(node.definitionFullName).toBe('nodox.module.mock.identity');
  });

  it('should create outputs', () => {
    const node = service.addNode(document, definition);
    expect(node.outputs.length).toBe(definition.outputs.length);
    expect(node.outputs[0]).toEqual<OutputConnector>({
      id: node.outputs[0].id,
      dataType: definition.outputs[0].dataType,
      name: definition.outputs[0].name,
      description: definition.outputs[0].description,
      label: definition.outputs[0].label,
      connectorType: ConnectorType.output,
      nodeId: node.id,
    });
  });

  it('should create inputs', () => {
    const node = service.addNode(document, definition);
    expect(node.inputs.length).toBe(definition.inputs.length);
    expect(node.inputs[0]).toEqual<InputConnector>({
      id: node.inputs[0].id,
      dataType: definition.inputs[0].dataType,
      definitionFullName: definition.fullName,
      name: definition.inputs[0].name,
      description: definition.inputs[0].description,
      label: definition.inputs[0].label,
      connectorType: ConnectorType.input,
      nodeId: node.id,
      connectionId: undefined,
      value: definition.inputs[0].defaultValue,
    });
  });
});

describe('NodoxService: canAcceptConnection', () => {
  const service = create(uuidIdProvider);
  service.registerModule(new DemoModule());
  service.registerModule(new Demo3Module());
  const definition = service.getDefinition('nodox.module.mock.identity');
  const document = service.createNewDocument();

  it('will result true if two connectors can connect', () => {
    const node1 = service.addNode(document, definition);
    const node2 = service.addNode(document, definition);
    const node3 = service.addNode(document, definition);
    // different nodes, same dataType
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.outputs[0]).canConnect).toBe(true);
    expect(service.canAcceptConnection(document, node2.outputs[0], node1.inputs[0]).canConnect).toBe(true);

    // same nodes
    expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(
      REASON_IDENTICAL_PARENT_NODE
    );
    expect(service.canAcceptConnection(document, node1.outputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(
      REASON_IDENTICAL_PARENT_NODE
    );

    // same connectorType
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).reason).toBe(
      REASON_IDENTICAL_CONNECTOR_TYPES
    );
    expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).reason).toBe(
      REASON_IDENTICAL_CONNECTOR_TYPES
    );

    service.connect(document, node2.inputs[0], node1.outputs[0]);
    service.connect(document, node3.inputs[0], node2.outputs[0]);
    expect(document.connections.length).toBe(2);

    expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).reason).toBe(
      REASON_CIRCULAR_DEPENDENCY
    );
    // other data types
  });

  it('will not connect inputs with mismatched data types', () => {
    const definitionIdentity = service.getDefinition('nodox.module.mock.identity');
    const definitionSomeString = service.getDefinition('nodox.module.mock3.somestring');
    const document = service.createNewDocument();

    const node1 = service.addNode(document, definitionIdentity);
    const node2 = service.addNode(document, definitionSomeString);

    // mismatched datatypes
    expect(service.canAcceptConnection(document, node1.inputs[0], node2.outputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node1.inputs[0], node2.outputs[0]).reason).toBe(
      REASON_DATATYPE_MISMATCH
    );
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.outputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.outputs[0]).reason).toBe(
      REASON_DATATYPE_MISMATCH
    );
  });

  it(`will will connect when one of the data types = ${CORE_MODULE_NAMESPACE}.any`, () => {
    const definitionIdentity = service.getDefinition('nodox.module.mock.identity');
    const definitionSomeString = service.getDefinition('nodox.module.mock3.somestring');
    const definitionAnything = service.getDefinition('nodox.module.mock3.anything');
    const document = service.createNewDocument();

    const node1 = service.addNode(document, definitionIdentity);
    const node2 = service.addNode(document, definitionSomeString);
    const node3 = service.addNode(document, definitionAnything);

    // mismatched datatypes
    expect(service.canAcceptConnection(document, node1.inputs[0], node3.outputs[0]).canConnect).toBe(true);
    expect(service.canAcceptConnection(document, node2.inputs[0], node3.outputs[0]).canConnect).toBe(true);
    expect(service.canAcceptConnection(document, node3.inputs[0], node1.outputs[0]).canConnect).toBe(true);
    expect(service.canAcceptConnection(document, node3.inputs[0], node2.outputs[0]).canConnect).toBe(true);
  });
});

describe('NodoxService: getConnections', () => {
  it('should return connections', () => {
    const service = create(uuidIdProvider);
    service.registerModule(new DemoModule());
    const document = service.createNewDocument();
    // eslint-disable-next-line no-unused-vars
    const connections = service.getConnections(document);
    expect(Array.isArray(connections)).toBe(true);
    expect(connections.length).toBe(0);
  });
});

const createBasicDocument = () => {
  const service = create(uuidIdProvider);
  const module = new DemoModule();
  service.registerModule(module);
  const document = service.createNewDocument();
  const identityDefinition = service.getDefinition('nodox.module.mock.identity');
  const toStringDefinition = service.getDefinition('nodox.module.mock.tostring');
  const iNode1 = service.addNode(document, identityDefinition);
  const iNode2 = service.addNode(document, identityDefinition);
  const sNode1 = service.addNode(document, toStringDefinition);
  const sNode2 = service.addNode(document, toStringDefinition);
  return { service, document, iNode1, iNode2, sNode1, sNode2 };
};

describe('createBasicDocument', () => {
  it('creates a document', () => {
    const { document, iNode1, iNode2, sNode1, sNode2 } = createBasicDocument();
    expect(document).toBeDefined();
    expect(document.nodes.length).toBe(4);

    expect(iNode1.inputs[0].dataType).toBe('nodox.module.mock.number');
    expect(iNode1.outputs[0].dataType).toBe('nodox.module.mock.number');
    expect(iNode2.inputs[0].dataType).toBe('nodox.module.mock.number');
    expect(iNode2.outputs[0].dataType).toBe('nodox.module.mock.number');
    expect(sNode1.inputs[0].dataType).toBe('nodox.module.mock.any');
    expect(sNode1.outputs[0].dataType).toBe('nodox.module.mock.string');
    expect(sNode2.inputs[0].dataType).toBe('nodox.module.mock.any');
    expect(sNode2.outputs[0].dataType).toBe('nodox.module.mock.string');
  });
});

describe('NodoxService: connect', () => {
  it('creates one connection', () => {
    const { document, service, iNode1, sNode1 } = createBasicDocument();
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    const connection2 = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    expect(connection2).toBeDefined();
    expect(sNode1.inputs[0].connectionId).toBe(connection2!.id);
    expect(connection2!.inputConnectorId).toBe(sNode1.inputs[0].id);
    expect(connection2!.outputConnectorId).toBe(iNode1.outputs[0].id);

    expect(document.connections.length).toBe(1);
    expect(document.connections[0].id).toBe(connection2!.id);
  });

  it('creates only one connection per input', () => {
    const { document, service, iNode1, iNode2, sNode1 } = createBasicDocument();
    const connection = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    expect(connection).toBeDefined();
    expect(sNode1.inputs[0].connectionId).toBe(connection!.id);
    expect(connection!.inputConnectorId).toBe(sNode1.inputs[0].id);
    expect(connection!.outputConnectorId).toBe(iNode1.outputs[0].id);

    const connection2 = service.connect(document, iNode2.outputs[0], sNode1.inputs[0]);
    expect(connection2).toBeDefined();
    expect(sNode1.inputs[0].connectionId).toBe(connection2!.id);
    expect(connection2!.inputConnectorId).toBe(sNode1.inputs[0].id);
    expect(connection2!.outputConnectorId).toBe(iNode2.outputs[0].id);

    expect(document.connections.length).toBe(1);
    expect(document.connections[0].id).toBe(connection2!.id);
  });

  it('creates multiple connections per output', () => {
    const { service, document, iNode1, sNode1, sNode2 } = createBasicDocument();
    const connection1 = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    const connection2 = service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
    expect(connection1).toBeDefined();
    expect(connection2).toBeDefined();

    expect(sNode1.inputs[0].connectionId).toBe(connection1!.id);
    expect(sNode2.inputs[0].connectionId).toBe(connection2!.id);
    expect(connection1!.inputConnectorId).toBe(sNode1.inputs[0].id);
    expect(connection2!.inputConnectorId).toBe(sNode2.inputs[0].id);

    expect(document.connections.length).toBe(2);
  });

  it('create no connection when the connector can not connect', () => {
    const { service, document, iNode1, sNode1 } = createBasicDocument();
    const connection1 = service.connect(document, iNode1.outputs[0], sNode1.outputs[0]);
    expect(connection1).toBeUndefined();
    const connection2 = service.connect(document, iNode1.inputs[0], iNode1.outputs[0]);
    expect(connection2).toBeUndefined();
  });
});

describe('NodoxService: deleteNode', () => {
  it('deletes a node', () => {
    const { service, document, iNode1 } = createBasicDocument();
    const numberOfNodes = document.nodes.length;
    service.deleteNode(document, iNode1);
    expect(document.nodes.length).toBe(numberOfNodes - 1);
    expect(service.getNode(document, iNode1.id)).toBeUndefined();
  });

  it('deletes the connections to a node', () => {
    const { service, document, iNode1, iNode2, sNode1, sNode2 } = createBasicDocument();
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
    service.connect(document, iNode2.outputs[0], iNode1.inputs[0]);

    expect(document.connections.length).toBe(3);
    service.deleteNode(document, iNode1);
    expect(document.connections.length).toBe(0);

    expect(sNode1.inputs[0].connectionId).toBeUndefined();
    expect(sNode2.inputs[0].connectionId).toBeUndefined();
  });

  it('does not delete other connections', () => {
    const { service, document, iNode1, iNode2, sNode1 } = createBasicDocument();
    const combineStringsDefinition = service.getDefinition('nodox.module.mock.combinestrings');
    const cNode1 = service.addNode(document, combineStringsDefinition);
    expect(cNode1).toBeDefined();

    service.connect(document, iNode2.outputs[0], iNode1.inputs[0]);
    service.connect(document, iNode2.outputs[0], cNode1.inputs[0]);
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    service.connect(document, iNode1.outputs[0], cNode1.inputs[1]);

    expect(document.connections.length).toBe(4);
    service.deleteNode(document, iNode1);
    expect(document.connections.length).toBe(1);

    expect(cNode1.inputs[0].connectionId).toBe(document.connections[0].id);
  });
});

describe('NodoxService: deleteNodes', () => {
  it('', () => {
    const { service, document, iNode1, iNode2, sNode1, sNode2 } = createBasicDocument();
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
    service.connect(document, iNode2.outputs[0], iNode1.inputs[0]);

    service.deleteNodes(document, [iNode1, iNode2, sNode1, sNode2]);
    expect(document.nodes.length).toBe(0);
    expect(document.connections.length).toBe(0);
  });
});

describe('NodoxService: getfromJson', () => {
  it('creates a document from JSON', () => {
    const { service, document, iNode1, iNode2, sNode1, sNode2 } = createBasicDocument();
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
    service.connect(document, iNode2.outputs[0], iNode1.inputs[0]);

    const newDocument = service.fromJson(JSON.stringify(document));
    expect(newDocument.nodes.length).toBe(4);
    expect(newDocument.connections.length).toBe(3);
  });
});

describe('NodoxService: getInput', () => {
  it('should find an inputConnector and the parent Node if the connector with id exists', () => {
    const { service, document, iNode1, sNode2 } = createBasicDocument();
    expect(service.getInput(document, iNode1.inputs[0].id)).toEqual({ node: iNode1, connector: iNode1.inputs[0] });
    expect(service.getInput(document, sNode2.inputs[0].id)).toEqual({ node: sNode2, connector: sNode2.inputs[0] });
    expect(service.getInput(document, 'does-not-exist')).toEqual({});
  });
});

describe('NodoxService: getOutput', () => {
  it('should find an outputConnector and the parent Node if the connector with id exists', () => {
    const { service, document, iNode1, sNode2 } = createBasicDocument();
    expect(service.getOutput(document, iNode1.outputs[0].id)).toEqual({ node: iNode1, connector: iNode1.outputs[0] });
    expect(service.getOutput(document, sNode2.outputs[0].id)).toEqual({ node: sNode2, connector: sNode2.outputs[0] });
    expect(service.getOutput(document, 'does-not-exist')).toEqual({});
  });
});

describe('NodoxService: getConnector', () => {
  it('should find an outputConnector and the parent Node if the connector with id exists', () => {
    const { service, document, iNode1, sNode2 } = createBasicDocument();
    expect(service.getConnector(document, iNode1.outputs[0].id)).toEqual({
      node: iNode1,
      connector: iNode1.outputs[0],
    });
    expect(service.getConnector(document, sNode2.inputs[0].id)).toEqual({ node: sNode2, connector: sNode2.inputs[0] });
    expect(service.getConnector(document, 'does-not-exist')).toEqual({});
  });
});

describe('NodoxService: getModules', () => {
  it('returns the modules registerd at a service', () => {
    const { service } = createBasicDocument();
    const modules = service.getModules();
    expect(modules.length).toBe(1);
    expect(modules[0].name).toBe('Mock');
  });
});

describe('NodoxService: getNode', () => {
  it('returns a node by id', () => {
    const { service, document, iNode1, sNode2 } = createBasicDocument();
    expect(service.getNode(document, iNode1.id)).toEqual(iNode1);
    expect(service.getNode(document, sNode2.id)).toEqual(sNode2);
  });
});

describe('NodoxService: getNodeFromConnector', () => {
  it('returns the parent node of a connector ', () => {
    const { service, document, iNode1, sNode2 } = createBasicDocument();
    expect(service.getNodeFromConnector(document, iNode1.inputs[0])).toEqual(iNode1);
    expect(service.getNodeFromConnector(document, sNode2.outputs[0])).toEqual(sNode2);
  });
});

describe('NodoxService: getNodes', () => {
  it('', () => {});
});

describe('NodoxService: indexOfConnector', () => {
  it('', () => {
    const { service, document, iNode1 } = createBasicDocument();
    const combineStringsDefinition = service.getDefinition('nodox.module.mock.combinestrings');
    const cNode1 = service.addNode(document, combineStringsDefinition);
    expect(cNode1).toBeDefined();

    expect(service.indexOfConnector(cNode1, cNode1.inputs[1])).toBe(1);
    expect(service.indexOfConnector(cNode1, cNode1.outputs[0])).toBe(0);
    expect(service.indexOfConnector(cNode1, iNode1.outputs[0])).toBe(-1);
  });
});

describe('NodoxService: cloneDocument', () => {
  it('clones a document with new ids', () => {
    const { service, document, iNode1, sNode2, iNode2, sNode1 } = createBasicDocument();

    iNode1.name = '--i1--';
    iNode2.name = '--i2--';
    sNode1.name = '--s1--';
    sNode2.name = '--s2--';

    // iNode1 => sNode1
    service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    // iNode1 => sNode2
    service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
    // iNode2 => iNode1
    service.connect(document, iNode2.outputs[0], iNode1.inputs[0]);

    const newDocument = service.cloneDocument(document);

    expect(newDocument).toBeDefined();
    expect(newDocument.nodes.length).toBe(4);
    expect(newDocument.connections.length).toBe(3);

    const newINode1 = newDocument.nodes.find(node => node.name === iNode1.name);
    const newINode2 = newDocument.nodes.find(node => node.name === iNode2.name);
    const newSNode1 = newDocument.nodes.find(node => node.name === sNode1.name);
    const newSNode2 = newDocument.nodes.find(node => node.name === sNode2.name);

    expect(newINode1).toBeDefined();
    expect(newINode2).toBeDefined();
    expect(newSNode1).toBeDefined();
    expect(newSNode2).toBeDefined();

    // iNode1 => sNode1
    const newConnection1 = newDocument.connections.find(
      connection =>
        connection.inputConnectorId === newSNode1?.inputs[0].id &&
        connection.outputConnectorId === newINode1?.outputs[0].id &&
        connection.inputNodeId === newSNode1.id &&
        connection.outputNodeId === newINode1.id
    );

    // iNode1 => sNode2
    const newConnection2 = newDocument.connections.find(
      connection =>
        connection.inputConnectorId === newSNode2?.inputs[0].id &&
        connection.outputConnectorId === newINode1?.outputs[0].id &&
        connection.inputNodeId === newSNode2.id &&
        connection.outputNodeId === newINode1.id
    );

    // iNode2 => iNode1
    const newConnection3 = newDocument.connections.find(
      connection =>
        connection.inputConnectorId === newINode1?.inputs[0].id &&
        connection.outputConnectorId === newINode2?.outputs[0].id &&
        connection.inputNodeId === newINode1.id &&
        connection.outputNodeId === newINode2.id
    );

    expect(newConnection1).toBeDefined();
    expect(newConnection2).toBeDefined();
    expect(newConnection3).toBeDefined();
  });
});

describe('NodoxService: removeConnection', () => {
  it('removes a connection', () => {
    const { service, document, iNode1, sNode1 } = createBasicDocument();
    const connection = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    expect(document.connections.length).toBe(1);
    expect(sNode1.inputs[0].connectionId).toBe(connection?.id);
    service.removeConnection(document, connection!.id);
    expect(sNode1.inputs[0].connectionId).toBe(undefined);
  });

  it('does not remove a connection that does not exist', () => {
    const { service, document, iNode1, sNode1 } = createBasicDocument();
    const connection = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    expect(document.connections.length).toBe(1);
    expect(sNode1.inputs[0].connectionId).toBe(connection?.id);
    service.removeConnection(document, 'does-not-exists');
    expect(document.connections.length).toBe(1);
  });

  it('does remove a connection even as the inputConnector does not exist', () => {
    const { service, document, iNode1, sNode1 } = createBasicDocument();
    const connection = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
    expect(document.connections.length).toBe(1);
    connection!.inputConnectorId = 'does-not-exists';
    service.removeConnection(document, connection!.id);
    expect(document.connections.length).toBe(0);
  });
});

describe('type guards', () => {
  it('isInput', () => {
    const { iNode1 } = createBasicDocument();
    expect(isInput(iNode1.inputs[0])).toBe(true);
    expect(isInput(iNode1.outputs[0])).toBe(false);
  });

  it('isOutput', () => {
    const { iNode1 } = createBasicDocument();
    expect(isOutput(iNode1.inputs[0])).toBe(false);
    expect(isOutput(iNode1.outputs[0])).toBe(true);
  });
});
