"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.uuidIdProvider = void 0;
var uuid_1 = require("uuid");
var interfaces_1 = require("./interfaces");
var uuidIdProvider = function () { return uuid_1.v4(); };
exports.uuidIdProvider = uuidIdProvider;
var createService = function (getId) {
    var modules = [];
    var getDefinitionLookup = function () { return modules.reduce(function (definitionLookup, module) {
        return module.definitions.reduce(function (lookup, definition) {
            lookup[definition.fullName] = definition;
            return lookup;
        }, definitionLookup);
    }, {}); };
    var getDefinition = function (fullName) { return getDefinitionLookup()[fullName]; };
    var registerModule = function (module) {
        module.definitions.forEach(function (definition) {
            definition.icon = definition.icon || "nodox:core_nodox";
            var existingDef = getDefinition(definition.fullName);
            if (existingDef) {
                throw new Error("duplicate definition (" + definition.fullName + "): " + module.name + " and " + existingDef.moduleName);
            }
        });
        var moduleNameSpaces = modules.map(function (m) { return m.namespace; });
        module.dependencies.forEach(function (dependency) {
            if (!moduleNameSpaces.includes(dependency)) {
                throw new Error("Module '" + module.namespace + "' dependency not met: " + dependency);
            }
        });
        modules.push(module);
    };
    var getModules = function () { return modules; };
    var byId = function (id) { return function (item) { return id === item.id; }; };
    var getNode = function (document, nodeId) { return document.nodes.find(byId(nodeId)); };
    var getConnection = function (document, connectionId) { return document.connections.find(byId(connectionId)); };
    var getInput = function (document, inputId) {
        var foundNode = document.nodes.find(function (node) { return node.inputs.find(byId(inputId)) !== undefined; });
        return { node: foundNode, input: foundNode === null || foundNode === void 0 ? void 0 : foundNode.inputs.find(byId(inputId)) };
    };
    var getOutput = function (document, outputId) {
        var foundNode = document.nodes.find(function (node) { return node.inputs.find(byId(outputId)); });
        return { node: foundNode, output: foundNode === null || foundNode === void 0 ? void 0 : foundNode.outputs.find(byId(outputId)) };
    };
    var indexOfConnector = function (node, connector) {
        var index = node.inputs.findIndex(byId(connector.id));
        return index > -1 ? index : node.outputs.findIndex(byId(connector.id));
    };
    var getNodeFromConnector = function (document, connector) {
        var result = document.nodes.find(function (n) {
            return n.inputs.findIndex(function (c) { return c.id == connector.id; }) > -1 ||
                n.outputs.findIndex(function (c) { return c.id == connector.id; }) > -1;
        });
        return result;
    };
    var removeConnection = function (document, connectionId) {
        var connection = getConnection(document, connectionId);
        if (connection !== undefined) {
            var input = getInput(document, connection.inputConnectorId).input;
            if (input !== undefined) {
                delete input.connectionId;
            }
            var output = getOutput(document, connection.outputConnectorId).output;
            if (output !== undefined) {
                delete output.connectionId;
            }
            var index = document.connections.indexOf(connection);
            if (index > -1) {
                document.connections.splice(index, 1);
            }
        }
    };
    var connect = function (document, inputConnector, outputConnector) {
        var oldConnectionIds = document
            .connections
            .filter(function (connection) { return connection.inputConnectorId == inputConnector.id; })
            .map(function (connection) { return connection.id; });
        if (canAcceptConnection(outputConnector, inputConnector)) {
            var connection = {
                id: getId(),
                inputConnectorId: inputConnector.id,
                outputConnectorId: outputConnector.id,
            };
            inputConnector.connectionId = connection.id;
            oldConnectionIds.forEach(function (id) {
                removeConnection(document, id);
            });
            document.connections.push(connection);
            return connection;
        }
        else {
            console.log("cannot accept, input " + inputConnector.dataType + ", output " + outputConnector.dataType);
            return undefined;
        }
    };
    var createNewDocument = function () {
        var newDocument = {
            id: getId(),
            name: "New Nodox document",
            connections: [],
            nodes: [],
        };
        return newDocument;
    };
    /**
     * Assigns new ids to document, nodes, node inputs, node outputs and connections
     * used for cloning a document
     * @param document
     */
    var reAssignIds = function (document) {
        document.id = getId();
        document.name += ".cloned";
        var oldConnectorIds = {};
        document.nodes.forEach(function (n) {
            var newId = getId();
            oldConnectorIds[n.id] = newId;
            n.id = newId;
            n.inputs.forEach(function (inputConnector) {
                var newInputId = getId();
                inputConnector.nodeId = n.id,
                    oldConnectorIds[inputConnector.id] = newInputId;
                inputConnector.id = newInputId;
            });
            n.outputs.forEach(function (outputConnector) {
                var newOutputId = getId();
                outputConnector.nodeId = n.id;
                oldConnectorIds[outputConnector.id] = newOutputId;
                outputConnector.id = oldConnectorIds[newOutputId];
            });
        });
        document.connections.forEach(function (connector) {
            connector.id = getId();
            connector.inputConnectorId = oldConnectorIds[connector.inputConnectorId];
            connector.outputConnectorId = oldConnectorIds[connector.outputConnectorId];
        });
        return document;
    };
    var fromJson = function (s) {
        var document = JSON.parse(s);
        return document;
    };
    var getConnections = function (document) { return document.connections; };
    var getNodes = function (document) { return document.nodes; };
    var doesAccept = function (incomingType, outgoingType) {
        //TODO refine using accepts of datatypes in Module
        //for now: always accept "nodox.core.any"
        if (incomingType == "nodox.modules.core.any" || outgoingType == "nodox.modules.core.any")
            return true;
        if (outgoingType == incomingType)
            return true;
        return false;
    };
    var canAcceptConnection = function (sourceConnector, targetConnector) {
        if (sourceConnector.connectorType == targetConnector.connectorType)
            return false;
        if (sourceConnector.nodeId == targetConnector.nodeId)
            return false;
        if (sourceConnector.dataType == targetConnector.dataType)
            return true;
        return doesAccept(sourceConnector.dataType, targetConnector.dataType);
    };
    var addNode = function (document, definition) {
        var toInputConnector = function (nodeId) { return function (inputDefinition) { return ({
            id: getId(),
            nodeId: nodeId,
            dataType: inputDefinition.dataType,
            name: inputDefinition.name,
            definitionFullName: definition.fullName,
            connectionId: interfaces_1.ConnectorType.input
        }); }; };
        var toOutputConnector = function (nodeId) { return function (outputDefinition) { return ({
            id: getId(),
            connectorType: interfaces_1.ConnectorType.output,
            dataType: outputDefinition.dataType,
            nodeId: nodeId
        }); }; };
        var id = getId();
        var node = {
            id: id,
            name: definition.name,
            definitionFullName: definition.fullName,
            inputs: definition.inputs.map(toInputConnector(id)),
            outputs: definition.outputs.map(toOutputConnector(id)),
            icon: definition.icon,
        };
        document.nodes.push(node);
        return node;
    };
    var deleteNodes = function (document, nodes) {
        nodes.forEach(function (n) { return deleteNode(document, n); });
    };
    var deleteNode = function (document, node) {
        document.connections.filter(function (connection) {
            return __spreadArray(__spreadArray([], node.inputs.map(function (input) { return input.connectionId; })), node.outputs.map(function (output) { return output.connectionId; })).includes(connection.id);
        })
            .forEach(function (connection) {
            removeConnection(document, connection.id);
        });
        document.nodes.splice(document.nodes.indexOf(node), 1);
    };
    return {
        getConnections: getConnections,
        getDefinition: getDefinition,
        addNode: addNode,
        canAcceptConnection: canAcceptConnection,
        connect: connect,
        createNewDocument: createNewDocument,
        deleteNode: deleteNode,
        deleteNodes: deleteNodes,
        fromJson: fromJson,
        getInput: getInput,
        getModules: getModules,
        getNode: getNode,
        getNodeFromConnector: getNodeFromConnector,
        getNodes: getNodes,
        getOutput: getOutput,
        indexOfConnector: indexOfConnector,
        reAssignIds: reAssignIds,
        registerModule: registerModule,
        removeConnection: removeConnection
    };
};
exports.createService = createService;
