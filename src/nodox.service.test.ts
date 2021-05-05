/* eslint-disable @typescript-eslint/no-explicit-any @typescript-eslint/no-unused-vars @typescript-eslint/no-empty-function */

import { createService, uuidIdProvider } from './nodox-service';
import { DemoModule } from './mocks/module';

describe('NodoxService: createNewDocument', () => {
  it('creates a new document', () => {
    const service = createService(uuidIdProvider);
    const document = service.createNewDocument();

    expect(document).toBeDefined();
    expect(document.id).toBeDefined();
    expect(Array.isArray(document.connections)).toBe(true);
    expect(document.connections.length).toBe(0);
    expect(Array.isArray(document.nodes)).toBe(true);
    expect(document.nodes.length).toBe(0);
  });
});

describe('NodoxService: registerModule', () => {
  it('should register a module', () => {
    const module = new DemoModule();
    const service = createService(uuidIdProvider);
    expect(service.getModules().length).toBe(0);
    service.registerModule(module);
    expect(service.getModules().length).toBe(1);
  });
});

describe('NodoxService: getDefinition', () => {
  const service = createService(uuidIdProvider);
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
  const service = createService(uuidIdProvider);
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
  const service = createService(uuidIdProvider);
  const module = new DemoModule();
  service.registerModule(module);
  const definition = service.getDefinition('nodox.modules.mock.identity');
  const document = service.createNewDocument();

  it('will result true if two connectors can connect', () => {
    const node1 = service.addNode(document, definition);
    const node2 = service.addNode(document, definition);
    // different nodes, same dataType
    expect(service.canAcceptConnection(node2.inputs[0], node1.outputs[0])).toBe(true);
    expect(service.canAcceptConnection(node2.outputs[0], node1.inputs[0])).toBe(true);

    // same nodes
    expect(service.canAcceptConnection(node1.inputs[0], node1.outputs[0])).toBe(false);
    expect(service.canAcceptConnection(node1.outputs[0], node1.inputs[0])).toBe(false);

    // same connectorType
    expect(service.canAcceptConnection(node2.inputs[0], node1.inputs[0])).toBe(false);
    expect(service.canAcceptConnection(node2.outputs[0], node1.outputs[0])).toBe(false);

    // other data types
  });
});

describe('NodoxService: getConnections', () => {
  it('should return connections', () => {
    const service = createService(uuidIdProvider);
    service.registerModule(new DemoModule());
    const document = service.createNewDocument();
    // eslint-disable-next-line no-unused-vars
    const connections = service.getConnections(document);
    expect(Array.isArray(service.getConnections(document))).toBe(true);
    expect(service.getConnections(document).length).toBe(0);
  });
});

describe('NodoxService: connect', () => {
  it('', () => {

  });
});

describe('NodoxService: deleteNode', () => {
  it('', () => {

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
