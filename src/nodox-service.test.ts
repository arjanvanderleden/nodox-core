import { create, REASON_CIRCULAR_DEPENDENCY, REASON_IDENTICAL_CONNECTOR_TYPES, REASON_IDENTICAL_PARENT_NODE, uuidIdProvider } from './nodox-service';
import { DemoModule } from './mocks/module';

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
});

describe('NodoxService: getDefinition', () => {
  const service = create(uuidIdProvider);
  service.registerModule(new DemoModule());

  it(' should return a registerd definition', () => {
    const definition = service.getDefinition('nodox.modules.mock.identity');
    expect(definition).toBeDefined();
    expect(definition.fullName).toBe('nodox.modules.mock.identity');
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
  const definition = service.getDefinition('nodox.modules.mock.identity');
  const document = service.createNewDocument();

  it('should create a node', () => {
    expect(service.getNodes(document).length).toBe(0);
    const node = service.addNode(document, definition);
    const nodes = service.getNodes(document);
    expect(nodes.length).toBe(1);
    expect(node).toEqual(nodes[0]);
    expect(node.definitionFullName).toBe('nodox.modules.mock.identity');
  });
});

describe('NodoxService: canAcceptConnection', () => {
  const service = create(uuidIdProvider);
  const module = new DemoModule();
  service.registerModule(module);
  const definition = service.getDefinition('nodox.modules.mock.identity');
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
    expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(REASON_IDENTICAL_PARENT_NODE);
    expect(service.canAcceptConnection(document, node1.outputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(REASON_IDENTICAL_PARENT_NODE);

    // same connectorType
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).reason).toBe(REASON_IDENTICAL_CONNECTOR_TYPES);
    expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).reason).toBe(REASON_IDENTICAL_CONNECTOR_TYPES);

    service.connect(document, node2.inputs[0], node1.outputs[0]);
    service.connect(document, node3.inputs[0], node2.outputs[0]);
    expect(document.connections.length).toBe(2);

    expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).canConnect).toBe(false);
    expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).reason).toBe(REASON_CIRCULAR_DEPENDENCY);
    // other data types
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
  const identityDefinition = service.getDefinition('nodox.modules.mock.identity');
  const toStringDefinition = service.getDefinition('nodox.modules.mock.tostring');
  const iNode1 = service.addNode(document, identityDefinition);
  const iNode2 = service.addNode(document, identityDefinition);
  const sNode1 = service.addNode(document, toStringDefinition);
  const sNode2 = service.addNode(document, toStringDefinition);
  return { service, document, iNode1, iNode2, sNode1, sNode2 };
};

describe('createBasicDoument', () => {
  it('creates a document', () => {
    const { document, iNode1, iNode2, sNode1, sNode2 } = createBasicDocument();
    expect(document).toBeDefined();
    expect(document.nodes.length).toBe(4);

    expect(iNode1.inputs[0].dataType).toBe('nodox.modules.mock.number');
    expect(iNode1.outputs[0].dataType).toBe('nodox.modules.mock.number');
    expect(iNode2.inputs[0].dataType).toBe('nodox.modules.mock.number');
    expect(iNode2.outputs[0].dataType).toBe('nodox.modules.mock.number');
    expect(sNode1.inputs[0].dataType).toBe('nodox.modules.mock.any');
    expect(sNode1.outputs[0].dataType).toBe('nodox.modules.mock.string');
    expect(sNode2.inputs[0].dataType).toBe('nodox.modules.mock.any');
    expect(sNode2.outputs[0].dataType).toBe('nodox.modules.mock.string');
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
});

describe('NodoxService: deleteNode', () => {
  it('deletes a node', () => {

  });

  it('deletes the connections to a node', () => {

  });

  it('does not delete other connections', () => {

  });
});

describe('NodoxService: deleteNodes', () => {
  it('', () => {

  });
});

describe('NodoxService: getfromJsonConnections', () => {
  it('', () => {

  });
});

describe('NodoxService: getInput', () => {
  it('', () => {

  });
});

describe('NodoxService: getModules', () => {
  it('', () => {

  });
});

describe('NodoxService: getNode', () => {
  it('', () => {

  });
});

describe('NodoxService: getNodeFromConnector', () => {
  it('', () => {

  });
});

describe('NodoxService: getNodes', () => {
  it('', () => {

  });
});

describe('NodoxService: getOutput', () => {
  it('', () => {

  });
});

describe('NodoxService: indexOfConnector', () => {
  it('', () => {

  });
});

describe('NodoxService: reAssignIds', () => {
  it('', () => {

  });
});

describe('NodoxService: removeConnection', () => {
  it('', () => {

  });
});
