"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = require("guid");
var nodox_models_1 = require("./nodox-models");
var IdProvider = (function () {
    function IdProvider() {
    }
    IdProvider.getId = function () {
        return this.id++;
    };
    IdProvider.id = 0;
    return IdProvider;
}());
var NodoxService = (function () {
    function NodoxService(serializer, messageBus) {
        this.serializer = serializer;
        this.messageBus = messageBus;
        this.modules = new Array();
        this.acceptingDatatypes = {};
    }
    NodoxService.prototype.getId = function () { return Guid.raw(); };
    NodoxService.prototype.registerModule = function (m) {
        var _this = this;
        m.definitions.forEach(function (d) {
            d.nodoxModule = m;
            d.icon = d.icon || "nodox:core_nodox";
            var existingDef = _this.find(_this.modules, function (m) { return m.definitions; }, function (def) { return def.fullName == d.fullName; });
            if (existingDef) {
                console.log("duplicate definition: " + d.fullName + ", " + d.nodoxModule.name + ", " + existingDef.nodoxModule.name);
            }
        });
        //TODO check for dependencies
        this.modules.push(m);
    };
    NodoxService.prototype.getModules = function () {
        return this.modules;
    };
    NodoxService.prototype.getNode = function (document, id) {
        return document.nodes.find(function (n) { return (n.id == id); });
    };
    NodoxService.prototype.getConnection = function (document, id) {
        return document.connections.find(function (c) { return c.id == id; });
    };
    NodoxService.prototype.getInput = function (document, id) {
        var result;
        document.nodes.find(function (n) { return n.inputs.find(function (i) { return (result = i).id == id; }) != null; });
        return result;
    };
    NodoxService.prototype.getOutput = function (document, id) {
        var result;
        document.nodes.find(function (n) { return n.outputs.find(function (o) { return (result = o).id == id; }) != null; });
        return result;
    };
    NodoxService.prototype.indexOfConnector = function (node, connector) {
        var index = node.inputs.findIndex(function (c) { return c.id == connector.id; });
        if (index > -1)
            return index;
        return node.outputs.findIndex(function (c) { return c.id == connector.id; });
    };
    NodoxService.prototype.getNodeFromConnector = function (document, connector) {
        var result = document.nodes.find(function (n) {
            return n.inputs.findIndex(function (c) { return c.id == connector.id; }) > -1 ||
                n.outputs.findIndex(function (c) { return c.id == connector.id; }) > -1;
        });
        return result;
    };
    NodoxService.prototype.removeConnection = function (document, connection) {
        if (connection == null)
            return;
        var input = connection.inputConnector;
        if (input.connection.id === connection.id) {
            input.connection = null;
        }
        var index = document.connections.indexOf(connection);
        if (index > -1) {
            document.connections.splice(index, 1);
        }
    };
    NodoxService.prototype.find = function (collection, property, predicate) {
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var item = collection_1[_i];
            var found = property(item).find(predicate);
            if (found)
                return found;
        }
        return null;
    };
    /**
     * set the connectors for nodes and connections of document
     * @param document : INodoxDocument
     * @param modules : INodoxModule[]
     */
    NodoxService.prototype.wire = function (document, modules) {
        var _this = this;
        document.cloneFunctions = {};
        this.modules.forEach(function (m) {
            Object.getOwnPropertyNames(m.cloneFunctions).forEach(function (cf) {
                if (document.cloneFunctions[cf])
                    console.warn("duplicate clone function for datatype %o", cf);
                document.cloneFunctions[cf] = m.cloneFunctions[cf];
            });
        });
        // update definition
        document.nodes.forEach(function (node) {
            node.definition = _this.find(modules, function (m) { return m.definitions; }, function (d) { return d.fullName.toLowerCase() == node.nodeType.toLowerCase(); });
            if (!node.definition) {
                console.warn("Node " + node.nodeType + " has no definition");
            }
            // update inputs
            node.inputs.forEach(function (i) {
                i.definition = node.definition.inputs.find(function (id) { return id.name.toLowerCase() == i.name.toLowerCase(); });
                if (!i.definition) {
                    console.warn("Input " + i.name + "(" + i.dataType + ")" + "has no definition");
                }
            });
        });
        document.connections.forEach(function (connection) {
            //set the outputNodes
            connection.inputNode = document.nodes.find(function (n) { return n.id === connection.inputNodeId; });
            if (!connection.inputNode) {
                var err = "No inputNode found for connection. inputNodeId=" + connection.inputNodeId;
                console.log(err);
                throw (err);
            }
            connection.outputNode = document.nodes.find(function (n) { return n.id === connection.outputNodeId; });
            if (!connection.inputNode) {
                var err = "No outNode found for connection. outputNodeId=" + connection.outputNodeId;
                console.log(err);
                throw (err);
            }
            var input = connection.inputNode.inputs.find(function (i) { return i.id === connection.inputConnectorId; });
            if (!input) {
                var err = "No Input found for connection. outputNodeId=" + connection.inputConnectorId;
                console.log(err);
                throw (err);
            }
            //TODO implement IDisposable pattern: garbage collection will have a problem here
            // Or implement a service.findConnection(connectionId) service.findInput(inputId) pattern
            input.connection = connection;
            connection.inputConnector = input;
            var output = connection.outputNode.outputs.find(function (i) { return i.id === connection.outputConnectorId; });
            if (!output) {
                var err = "No Output found for connection. outputConnectorId=" + connection.outputConnectorId;
                console.log(err);
                throw (err);
            }
            connection.outputConnector = output;
        });
    };
    // connect two nodes
    NodoxService.prototype.connect = function (document, inputConnector, outputConnector) {
        var _this = this;
        var oldConnections = document.connections.filter(function (c) { return c.inputConnector == inputConnector; });
        if (this.canAcceptConnection(outputConnector, inputConnector)) {
            var connection = new nodox_models_1.Connection();
            connection.id = this.getId();
            connection.documentId = document.id;
            connection.inputConnectorId = inputConnector.id;
            connection.outputConnectorId = outputConnector.id;
            connection.inputNodeId = inputConnector.nodeId;
            connection.outputNodeId = outputConnector.nodeId;
            connection.inputConnector = inputConnector;
            connection.outputConnector = outputConnector;
            connection.inputNode = this.getNode(document, inputConnector.nodeId);
            connection.outputNode = this.getNode(document, outputConnector.nodeId);
            //connection.canvasManager = connection.inputNode.canvasManager;
            inputConnector.connection = connection;
            oldConnections.forEach(function (oc) {
                _this.removeConnection(document, oc);
            });
            document.connections.push(connection);
        }
    };
    NodoxService.prototype.createNewDocument = function () {
        var newDoc = new nodox_models_1.NodoxDocument();
        newDoc.id = this.getId();
        newDoc.name = "New Nodox document";
        return newDoc;
    };
    /**
     * Assigns new ids to document, nodes, node inputs, node outputs and connections
     * used for cloning a document
     * @param document
     */
    NodoxService.prototype.reAssignIds = function (document) {
        var _this = this;
        var newDocumentId = this.getId();
        document.id = newDocumentId;
        document.name += ".cloned";
        var oldNodeIds = {};
        document.nodes.forEach(function (n) {
            var newId = _this.getId();
            oldNodeIds[n.id] = newId;
            n.id = newId;
            n.documentId = newDocumentId;
            n.inputs.forEach(function (i) { return i.nodeId == n.id; });
            n.outputs.forEach(function (o) { return o.nodeId == n.id; });
        });
        document.connections.forEach(function (c) {
            c.id = _this.getId();
            c.documentId = newDocumentId;
            c.inputNodeId = oldNodeIds[c.inputNodeId];
            c.outputNodeId = oldNodeIds[c.outputNodeId];
        });
    };
    /**
     * Returns a json string serialized by the serializer
     * @param document
     */
    NodoxService.prototype.getDocumentJson = function (document) {
        return this.serializer.SerializeDocument(document);
    };
    /**
     * Returns a wired document from a json string;
     * @param s
     */
    NodoxService.prototype.fromJson = function (s) {
        var document;
        if (typeof (s) == 'string') {
            var document = JSON.parse(s);
            this.wire(document, this.modules);
        }
        return document;
    };
    NodoxService.prototype.getConnections = function (document) {
        return document.connections;
    };
    NodoxService.prototype.getNodes = function (document) {
        return document.nodes;
    };
    NodoxService.prototype.doesAccept = function (incomingType, outgoingType) {
        //TODO refine using accepts of datatypes in Module
        //for now: always accept "nodox.core.any"
        if (incomingType == "nodox.modules.core.any" || outgoingType == "nodox.modules.core.any")
            return true;
        if (outgoingType == incomingType)
            return true;
        return false;
    };
    /**
     * Return true if source and tarhet connector match with respect to dataType
     * @param sourceConnector
     * @param targetConnector
     */
    NodoxService.prototype.canAcceptConnection = function (sourceConnector, targetConnector) {
        if (sourceConnector.connectorType == targetConnector.connectorType)
            return false;
        if (sourceConnector.nodeId == targetConnector.nodeId)
            return false;
        if (sourceConnector.dataType == targetConnector.dataType)
            return true;
        return this.doesAccept(sourceConnector.dataType, targetConnector.dataType);
    };
    /**
     * Adss a new Node to document
     * @param document
     * @param definition
     */
    NodoxService.prototype.addNode = function (document, definition) {
        var _this = this;
        var node = new nodox_models_1.Node();
        node.id = this.getId();
        node.name = definition.name;
        node.point = new nodox_models_1.Point(0, 0); // todo is event point if created from event
        node.nodeType = definition.fullName;
        node.definition = definition;
        node.documentId = document.id;
        //model
        node.inputs = new Array();
        definition.inputs.forEach(function (id) {
            var input = new nodox_models_1.Input();
            input.id = _this.getId();
            input.dataType = id.dataType;
            input.name = id.name;
            input.value = (typeof (id.defaultValue) === "function") ? id.defaultValue() : id.defaultValue;
            input.definition = id;
            //wiring up:
            input.nodeId = node.id;
            node.inputs.push(input);
        });
        node.outputs = new Array();
        definition.outputs.forEach(function (od) {
            var output = new nodox_models_1.Output();
            output.dataType = od.dataType;
            output.name = od.name;
            //wiring up:
            output.nodeId = node.id;
            output.id = _this.getId();
            node.outputs.push(output);
        });
        node.icon = definition.icon;
        document.nodes.push(node);
    };
    /**
     * Delete a selection of nodes and the connected connections
     * @param document
     * @param nodes
     */
    NodoxService.prototype.deleteSelection = function (document, nodes) {
        var _this = this;
        nodes.forEach(function (n) { return _this.deleteNode(document, n); });
    };
    /**
     * Delete a node and the connected connections
     * @param document
     * @param node
     */
    NodoxService.prototype.deleteNode = function (document, node) {
        var _this = this;
        var connections = document.connections.filter(function (c) { return c.inputNodeId == node.id || c.outputNodeId == node.id; });
        connections.forEach(function (c) {
            var p = _this.removeConnection(document, c);
        });
        document.nodes.splice(document.nodes.indexOf(node), 1);
    };
    return NodoxService;
}());
exports.NodoxService = NodoxService;
