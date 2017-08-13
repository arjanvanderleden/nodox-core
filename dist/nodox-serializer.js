"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodox_models_1 = require("./nodox-models");
var Serializer = (function () {
    function Serializer() {
    }
    Serializer.prototype.SerializeDocument = function (document) {
        var doc = new nodox_models_1.NodoxDocument().merge(document);
        document.nodes.forEach(function (n) { return doc.nodes.push(new nodox_models_1.Node().merge(n)); });
        document.connections.forEach(function (c) { return doc.connections.push(new nodox_models_1.Connection().merge(c)); });
        return JSON.stringify(doc, null, '\t');
    };
    return Serializer;
}());
exports.Serializer = Serializer;
