"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_interfaces_1 = require("./interfaces/core-interfaces");
/**
    @class Node
*/
var Node = (function () {
    function Node() {
        this.processResult = null;
        this.inputParams = null;
        this.icon = "nodes:default";
        this.point = new Point(0, 0);
        this.inputs = new Array();
        this.outputs = new Array();
    }
    Node.prototype.isDirty = function () {
        return (this.dirty || false); // dirty || inputs are dirty
    };
    Node.prototype.merge = function (n) {
        var _this = this;
        this.id = n.id;
        this.name = n.name;
        this.nodeType = n.nodeType;
        this.documentId = n.documentId;
        this.point = new Point(n.point.x, n.point.y);
        n.inputs.forEach(function (i) { return _this.inputs.push(new Input().merge(i)); });
        n.outputs.forEach(function (o) { return _this.outputs.push(new Output().merge(o)); });
        return this;
    };
    Node.prototype.dispose = function () {
        this.inputs.forEach(function (i) { return i.connection = null; });
    };
    return Node;
}());
exports.Node = Node;
var NodeValues = (function () {
    function NodeValues() {
    }
    return NodeValues;
}());
exports.NodeValues = NodeValues;
var ConnectorValue = (function () {
    function ConnectorValue() {
    }
    return ConnectorValue;
}());
exports.ConnectorValue = ConnectorValue;
var Output = (function () {
    function Output() {
        this.connectorType = core_interfaces_1.ConnectorType.Output;
    }
    //connections = new Array<IConnection>();
    Output.prototype.isInput = function () { return false; };
    Output.prototype.merge = function (o) {
        this.dataType = o.dataType;
        this.connectorType = o.connectorType;
        this.id = o.id;
        this.index = o.index;
        this.label = o.label;
        this.name = o.name;
        this.nodeId = o.nodeId;
        return this;
    };
    Output.prototype.dispose = function () {
    };
    return Output;
}());
exports.Output = Output;
var Input = (function () {
    function Input() {
        this.connectorType = core_interfaces_1.ConnectorType.Input;
    }
    Input.prototype.isInput = function () { return true; };
    Input.prototype.merge = function (i) {
        this.dataType = i.dataType;
        this.connectorType = i.connectorType;
        this.id = i.id;
        this.index = i.index;
        this.label = i.label;
        this.name = i.name;
        this.nodeId = i.nodeId;
        this.value = i.value;
        return this;
    };
    Input.prototype.dispose = function () {
        this.connection = null;
    };
    return Input;
}());
exports.Input = Input;
///
var Connection = (function () {
    function Connection() {
    }
    Connection.prototype.merge = function (c) {
        this.id = c.id;
        this.documentId = c.documentId;
        this.inputConnectorId = c.inputConnectorId;
        this.inputNodeId = c.inputNodeId;
        this.outputConnectorId = c.outputConnectorId;
        this.outputNodeId = c.outputNodeId;
        return this;
    };
    Connection.prototype.dispose = function () {
        this.inputConnector = null;
        this.inputNode = null;
        this.outputConnector = null;
        this.outputNode = null;
    };
    return Connection;
}());
exports.Connection = Connection;
var NodoxDocument = (function () {
    function NodoxDocument() {
        this.cloneFunctions = {};
        this.nodes = new Array();
        this.connections = new Array();
    }
    NodoxDocument.prototype.merge = function (p) {
        this.id = p.id;
        this.author = p.author;
        this.authorEmail = p.authorEmail;
        this.description = p.description;
        this.name = p.name;
        this.resultNodeId = this.resultNodeId;
        return this;
    };
    NodoxDocument.prototype.dispose = function () {
        this.connections.forEach(function (c) { return c.dispose; });
        this.nodes.forEach(function (n) { return n.dispose(); });
    };
    return NodoxDocument;
}());
exports.NodoxDocument = NodoxDocument;
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
    Point.prototype.snapTo = function (gridX, gridY) {
        var x = Math.round(this.x / gridX) * gridX;
        var y = Math.round(this.y / gridY) * gridY;
        return new Point(x, y);
    };
    Point.prototype.scale = function (factor) {
        return new Point(this.x * factor, this.y * factor);
    };
    Point.prototype.scaleRelativeTo = function (point, factor) {
        return this.subtract(point).scale(factor).add(point);
    };
    Point.prototype.subtract = function (p) {
        return new Point(this.x - p.x, this.y - p.y);
    };
    return Point;
}());
exports.Point = Point;
