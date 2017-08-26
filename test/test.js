"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var dist_1 = require("../dist");
var test_module_1 = require("./test-module");
var service;
var document;
var firstNode;
var secondNode;
describe('#NodoxService', function () {
    beforeEach(function () {
        service = new dist_1.NodoxService();
        var module = new test_module_1.TestModule();
        service.registerModule(module);
    });
    it('should have one module', function () {
        var ms = service.getModules();
        chai_1.expect(ms.length).to.be.equal(1);
    });
    it('with 2 definitions', function () {
        var module = service.getModules()[0];
        chai_1.expect(module.definitions.length).to.be.equal(2);
    });
    it('return a definition by its fullName', function () {
        var definition = service.getDefinition('test.add');
        chai_1.expect(definition).to.be.a('object');
        chai_1.expect(definition.fullName).to.be.equal('test.add');
    });
    it('should create a new Nodox document', function () {
        document = service.createNewDocument();
        chai_1.expect(document).to.be.a('object');
    });
    it('that should have no nodes', function () {
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(0);
    });
    it('should return definition with fullname "test.add"', function () {
        var definitionAdd = service.getDefinition('test.add');
        chai_1.expect(definitionAdd, 'definitionAdd').to.be.a('object');
        var definitionMax = service.getDefinition('test.max');
        chai_1.expect(definitionMax, 'definitionMax').to.be.a('object');
    });
    it('should return a node after adding', function () {
        var definitionMax = service.getDefinition('test.max');
        firstNode = service.addNode(document, definitionMax);
        chai_1.expect(firstNode).to.be.a('object');
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(1);
    });
    it('should have two nodes with different ids after adding an other', function () {
        var definitionAdd = service.getDefinition('test.add');
        secondNode = service.addNode(document, definitionAdd);
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(2);
        chai_1.expect(nodes[0].id, 'id 1').not.to.be.empty;
        chai_1.expect(nodes[1].id, 'id 2').not.to.be.empty;
        chai_1.expect(nodes[0].id).not.to.be.equal(nodes[1].id);
    });
    it('should connect two nodes', function () {
        var nodes = service.getNodes(document);
        var nodeMax = nodes[0];
        var nodeAdd = nodes[1];
        chai_1.expect(nodeMax.definition.fullName, 'nodeMax.definition.fullName').to.be.equal('test.max');
        chai_1.expect(nodeAdd.definition.fullName, 'nodeAdd.definition.fullName').to.be.equal('test.add');
        var connection = service.connect(document, nodeAdd.inputs[0], nodeMax.outputs[0]);
        chai_1.expect(connection, 'connection').to.be.a('object');
    });
});
