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
        service.registerModule(test_module_1.testModule);
    });
    it('should have one module', function () {
        var ms = service.getModules();
        chai_1.expect(ms.length).to.be.equal(1);
    });
    it('with 2 definitions', function () {
        var module = service.getModules()[0];
        chai_1.expect(module.definitions.length).to.be.equal(2);
    });
    it('should create a new Nodox document', function () {
        document = service.createNewDocument();
        chai_1.expect(document).to.be.a('object');
    });
    it('that should have no nodes', function () {
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(0);
    });
    it('it should return a node after adding', function () {
        var module = service.getModules()[0];
        firstNode = service.addNode(document, module.definitions[0]);
        chai_1.expect(firstNode).to.be.a('object');
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(1);
    });
    it('it should have two node after adding an other', function () {
        var module = service.getModules()[0];
        secondNode = service.addNode(document, module.definitions[1]);
        var nodes = service.getNodes(document);
        chai_1.expect(nodes.length).equals(2);
    });
});
