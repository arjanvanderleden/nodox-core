import { expect } from 'chai';
import 'mocha';
import { NodoxService, INodoxModule, NodoxDocument, INode } from '../dist'
import {TestModule} from './test-module';
var service: NodoxService;
var document: NodoxDocument;
var firstNode : INode;
var secondNode : INode;



describe('#NodoxService', () => {

    beforeEach(() => {
        service = new NodoxService();
        var module = new TestModule();
        service.registerModule(module);
    });

    it('should have one module',()=>{
        var ms = service.getModules();
        expect(ms.length).to.be.equal(1);
    })

    it('with 2 definitions',()=>{
        var module = service.getModules()[0];
        expect(module.definitions.length).to.be.equal(2);
    })

    it('return a definition by its fullName',()=>{
        var definition = service.getDefinition('test.add');
        expect(definition).to.be.a('object');
        expect(definition.fullName).to.be.equal('test.add');
    })


    it('should create a new Nodox document', ()=> {
        document = service.createNewDocument();
        expect(document).to.be.a('object');
    });

    it('that should have no nodes', ()=> {
        var nodes = service.getNodes(document);
        expect(nodes.length).equals(0);
    });

    it('should return definition with fullname "test.add"', ()=> {
        var definitionAdd = service.getDefinition('test.add');
        expect(definitionAdd,'definitionAdd').to.be.a('object');
        var definitionMax = service.getDefinition('test.max');
        expect(definitionMax,'definitionMax').to.be.a('object');
    });

    it('should return a node after adding', ()=> {
        var definitionMax = service.getDefinition('test.max');
        firstNode = service.addNode(document, definitionMax);
        expect(firstNode).to.be.a('object');
        var nodes = service.getNodes(document);
        expect(nodes.length).equals(1);
    });

    it('should have two nodes with different ids after adding an other', ()=> {
        var definitionAdd = service.getDefinition('test.add');
        secondNode = service.addNode(document, definitionAdd);
        var nodes = service.getNodes(document);
        expect(nodes.length).equals(2);
        expect(nodes[0].id,'id 1').not.to.be.empty;
        expect(nodes[1].id,'id 2').not.to.be.empty;
        expect(nodes[0].id).not.to.be.equal(nodes[1].id);
    });


    it('should connect two nodes',()=>{
        var nodes = service.getNodes(document);
        var nodeMax = nodes[0];
        var nodeAdd = nodes[1];
        expect(nodeMax.definition.fullName,'nodeMax.definition.fullName').to.be.equal('test.max');
        expect(nodeAdd.definition.fullName,'nodeAdd.definition.fullName').to.be.equal('test.add');

        var connection = service.connect(document, nodeAdd.inputs[0], nodeMax.outputs[0]);
        expect(connection,'connection').to.be.a('object');
    })



});