"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodox_service_1 = require("./nodox-service");
var module_1 = require("./mocks/module");
describe('NodoxService: createNewDocument', function () {
    it('creates a new document', function () {
        var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
        var metaData = { x: 'y' };
        var document = service.createNewDocument(metaData);
        expect(document).toBeDefined();
        expect(document.id).toBeDefined();
        expect(Array.isArray(document.connections)).toBe(true);
        expect(document.connections.length).toBe(0);
        expect(Array.isArray(document.nodes)).toBe(true);
        expect(document.nodes.length).toBe(0);
        expect(document.metaData).toBeDefined();
        expect(document.metaData.x).toBe('y');
    });
    it('creates a new document', function () {
        var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
        var document = service.createNewDocument();
        expect(document).toBeDefined();
        expect(document.metaData).toBeUndefined();
    });
});
describe('NodoxService: registerModule', function () {
    it('should register a module', function () {
        var module = new module_1.DemoModule();
        var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
        expect(service.getModules().length).toBe(0);
        service.registerModule(module);
        expect(service.getModules().length).toBe(1);
    });
});
describe('NodoxService: getDefinition', function () {
    var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
    service.registerModule(new module_1.DemoModule());
    it(' should return a registerd definition', function () {
        var definition = service.getDefinition('nodox.modules.mock.identity');
        expect(definition).toBeDefined();
        expect(definition.fullName).toBe('nodox.modules.mock.identity');
        expect(definition.inputs[0].name).toBe('a');
    });
    it('should return undefined for not registered definitions', function () {
        var definition = service.getDefinition('does-not-exist');
        expect(definition).toBeUndefined();
    });
});
describe('NodoxService: addNode', function () {
    var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
    var module = new module_1.DemoModule();
    service.registerModule(module);
    var definition = service.getDefinition('nodox.modules.mock.identity');
    var document = service.createNewDocument();
    it('should create a node', function () {
        expect(service.getNodes(document).length).toBe(0);
        var node = service.addNode(document, definition);
        var nodes = service.getNodes(document);
        expect(nodes.length).toBe(1);
        expect(node).toEqual(nodes[0]);
        expect(node.definitionFullName).toBe('nodox.modules.mock.identity');
    });
});
describe('NodoxService: canAcceptConnection', function () {
    var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
    var module = new module_1.DemoModule();
    service.registerModule(module);
    var definition = service.getDefinition('nodox.modules.mock.identity');
    var document = service.createNewDocument();
    it('will result true if two connectors can connect', function () {
        var node1 = service.addNode(document, definition);
        var node2 = service.addNode(document, definition);
        var node3 = service.addNode(document, definition);
        // different nodes, same dataType
        expect(service.canAcceptConnection(document, node2.inputs[0], node1.outputs[0]).canConnect).toBe(true);
        expect(service.canAcceptConnection(document, node2.outputs[0], node1.inputs[0]).canConnect).toBe(true);
        // same nodes
        expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).canConnect).toBe(false);
        expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(nodox_service_1.REASON_IDENTICAL_PARENT_NODE);
        expect(service.canAcceptConnection(document, node1.outputs[0], node1.inputs[0]).canConnect).toBe(false);
        expect(service.canAcceptConnection(document, node1.inputs[0], node1.outputs[0]).reason).toBe(nodox_service_1.REASON_IDENTICAL_PARENT_NODE);
        // same connectorType
        expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).canConnect).toBe(false);
        expect(service.canAcceptConnection(document, node2.inputs[0], node1.inputs[0]).reason).toBe(nodox_service_1.REASON_IDENTICAL_CONNECTOR_TYPES);
        expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).canConnect).toBe(false);
        expect(service.canAcceptConnection(document, node2.outputs[0], node1.outputs[0]).reason).toBe(nodox_service_1.REASON_IDENTICAL_CONNECTOR_TYPES);
        service.connect(document, node2.inputs[0], node1.outputs[0]);
        service.connect(document, node3.inputs[0], node2.outputs[0]);
        expect(document.connections.length).toBe(2);
        expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).canConnect).toBe(false);
        expect(service.canAcceptConnection(document, node3.outputs[0], node1.inputs[0]).reason).toBe(nodox_service_1.REASON_CIRCULAR_DEPENDENCY);
        // other data types
    });
});
describe('NodoxService: getConnections', function () {
    it('should return connections', function () {
        var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
        service.registerModule(new module_1.DemoModule());
        var document = service.createNewDocument();
        // eslint-disable-next-line no-unused-vars
        var connections = service.getConnections(document);
        expect(Array.isArray(connections)).toBe(true);
        expect(connections.length).toBe(0);
    });
});
var createBasicDocument = function () {
    var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
    var module = new module_1.DemoModule();
    service.registerModule(module);
    var document = service.createNewDocument();
    var identityDefinition = service.getDefinition('nodox.modules.mock.identity');
    var toStringDefinition = service.getDefinition('nodox.modules.mock.tostring');
    var iNode1 = service.addNode(document, identityDefinition);
    var iNode2 = service.addNode(document, identityDefinition);
    var sNode1 = service.addNode(document, toStringDefinition);
    var sNode2 = service.addNode(document, toStringDefinition);
    return { service: service, document: document, iNode1: iNode1, iNode2: iNode2, sNode1: sNode1, sNode2: sNode2 };
};
describe('createBasicDoument', function () {
    it('creates a document', function () {
        var _a = createBasicDocument(), document = _a.document, iNode1 = _a.iNode1, iNode2 = _a.iNode2, sNode1 = _a.sNode1, sNode2 = _a.sNode2;
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
describe('NodoxService: connect', function () {
    it('creates one connection', function () {
        var _a = createBasicDocument(), document = _a.document, service = _a.service, iNode1 = _a.iNode1, sNode1 = _a.sNode1;
        service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
        var connection2 = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
        expect(connection2).toBeDefined();
        expect(sNode1.inputs[0].connectionId).toBe(connection2.id);
        expect(connection2.inputConnectorId).toBe(sNode1.inputs[0].id);
        expect(connection2.outputConnectorId).toBe(iNode1.outputs[0].id);
        expect(document.connections.length).toBe(1);
        expect(document.connections[0].id).toBe(connection2.id);
    });
    it('creates only one connection per input', function () {
        var _a = createBasicDocument(), document = _a.document, service = _a.service, iNode1 = _a.iNode1, iNode2 = _a.iNode2, sNode1 = _a.sNode1;
        var connection = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
        expect(connection).toBeDefined();
        expect(sNode1.inputs[0].connectionId).toBe(connection.id);
        expect(connection.inputConnectorId).toBe(sNode1.inputs[0].id);
        expect(connection.outputConnectorId).toBe(iNode1.outputs[0].id);
        var connection2 = service.connect(document, iNode2.outputs[0], sNode1.inputs[0]);
        expect(connection2).toBeDefined();
        expect(sNode1.inputs[0].connectionId).toBe(connection2.id);
        expect(connection2.inputConnectorId).toBe(sNode1.inputs[0].id);
        expect(connection2.outputConnectorId).toBe(iNode2.outputs[0].id);
        expect(document.connections.length).toBe(1);
        expect(document.connections[0].id).toBe(connection2.id);
    });
    it('creates multiple connections per output', function () {
        var _a = createBasicDocument(), service = _a.service, document = _a.document, iNode1 = _a.iNode1, sNode1 = _a.sNode1, sNode2 = _a.sNode2;
        var connection1 = service.connect(document, iNode1.outputs[0], sNode1.inputs[0]);
        var connection2 = service.connect(document, iNode1.outputs[0], sNode2.inputs[0]);
        expect(connection1).toBeDefined();
        expect(connection2).toBeDefined();
        expect(sNode1.inputs[0].connectionId).toBe(connection1.id);
        expect(sNode2.inputs[0].connectionId).toBe(connection2.id);
        expect(connection1.inputConnectorId).toBe(sNode1.inputs[0].id);
        expect(connection2.inputConnectorId).toBe(sNode2.inputs[0].id);
        expect(document.connections.length).toBe(2);
    });
});
describe('NodoxService: deleteNode', function () {
    it('deletes a node', function () {
    });
    it('deletes the connections to a node', function () {
    });
    it('does not delete other connections', function () {
    });
});
describe('NodoxService: deleteNodes', function () {
    it('', function () {
    });
});
describe('NodoxService: getfromJsonConnections', function () {
    it('', function () {
    });
});
describe('NodoxService: getInput', function () {
    it('', function () {
    });
});
describe('NodoxService: getModules', function () {
    it('', function () {
    });
});
describe('NodoxService: getNode', function () {
    it('', function () {
    });
});
describe('NodoxService: getNodeFromConnector', function () {
    it('', function () {
    });
});
describe('NodoxService: getNodes', function () {
    it('', function () {
    });
});
describe('NodoxService: getOutput', function () {
    it('', function () {
    });
});
describe('NodoxService: indexOfConnector', function () {
    it('', function () {
    });
});
describe('NodoxService: reAssignIds', function () {
    it('', function () {
    });
});
describe('NodoxService: removeConnection', function () {
    it('', function () {
    });
});
