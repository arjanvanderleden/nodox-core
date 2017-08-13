'use strict';

var expect = require('chai').expect;
var NodoxService = require('../dist/src/nodox-service').NodoxService;
var service = new NodoxService();

describe('#NodoxService', function() {
    it('should create a new Nodoc document', function() {
        var result = service.createNewDocument();
        expect(result).to.be.a('object');
    });

    
});