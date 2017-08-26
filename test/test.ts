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

    it('it should return a node after adding', ()=> {
        var module = service.getModules()[0];
        firstNode = service.addNode(document, module.definitions[0]);
        expect(firstNode).to.be.a('object');
        var nodes = service.getNodes(document);
        expect(nodes.length).equals(1);
    });

    it('it should have two node after adding an other', ()=> {
        var module = service.getModules()[0];
        secondNode = service.addNode(document, module.definitions[1]);
        var nodes = service.getNodes(document);
        expect(nodes.length).equals(2);
    });



});