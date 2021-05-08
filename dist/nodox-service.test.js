"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any @typescript-eslint/no-unused-vars @typescript-eslint/no-empty-function */
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
describe('NodoxService: getConnections', function () {
    it('should return connections', function () {
        var service = nodox_service_1.create(nodox_service_1.uuidIdProvider);
        service.registerModule(new module_1.DemoModule());
        var document = service.createNewDocument();
        // eslint-disable-next-line no-unused-vars
        var connections = service.getConnections(document);
        expect(Array.isArray(service.getConnections(document))).toBe(true);
        expect(service.getConnections(document).length).toBe(0);
    });
});
describe('NodoxService: connect', function () {
    it('creates one connection', function () {
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
