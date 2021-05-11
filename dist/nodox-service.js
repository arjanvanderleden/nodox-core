"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.uuidIdProvider = void 0;
var uuid_1 = require("uuid");
var types_1 = require("./types");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var uuidIdProvider = function () { return uuid_1.v4(); };
exports.uuidIdProvider = uuidIdProvider;
var create = function (getId) {
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
            definition.icon = definition.icon || 'nodox:core_nodox';
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
        var node = document.nodes.find(function (node) { return node.inputs.find(byId(inputId)) !== undefined; });
        return { node: node, connector: node === null || node === void 0 ? void 0 : node.inputs.find(byId(inputId)) };
    };
    var getOutput = function (document, outputId) {
        var node = document.nodes.find(function (node) { return node.inputs.find(byId(outputId)) !== undefined; });
        return { node: node, connector: node === null || node === void 0 ? void 0 : node.outputs.find(byId(outputId)) };
    };
    var getConnector = function (document, id) {
        var _a = getInput(document, id), node = _a.node, connector = _a.connector;
        return connector !== undefined ? { node: node, connector: connector } : getOutput(document, id);
    };
    var indexOfConnector = function (node, connector) {
        var index = node.inputs.findIndex(byId(connector.id));
        return index > -1 ? index : node.outputs.findIndex(byId(connector.id));
    };
    var getNodeFromConnector = function (document, connector) {
        var node = getNode(document, connector.nodeId);
        return node;
    };
    var removeConnection = function (document, connectionId) {
        var connection = getConnection(document, connectionId);
        if (connection !== undefined) {
            var input = getInput(document, connection.inputConnectorId).connector;
            if (input !== undefined) {
                delete input.connectionId;
            }
            var output = getOutput(document, connection.outputConnectorId).connector;
            if (output !== undefined) {
                delete output.connectionId;
            }
            var index = document.connections.indexOf(connection);
            if (index > -1) {
                document.connections.splice(index, 1);
            }
        }
    };
    var connect = function (document, firstConnector, secondConnector) {
        var _a = firstConnector.connectorType === types_1.ConnectorType.input
            ? { inputConnector: firstConnector, outputConnector: secondConnector }
            : { inputConnector: secondConnector, outputConnector: firstConnector }, inputConnector = _a.inputConnector, outputConnector = _a.outputConnector;
        if (outputConnector.connectionId !== types_1.ConnectorType.output || !canAcceptConnection(outputConnector, inputConnector)) {
            return undefined;
        }
        var currentInputConnections = document
            .connections
            .filter(function (connection) { return connection.inputConnectorId === inputConnector.id; })
            .map(function (connection) { return connection.id; });
        var connection = {
            id: getId(),
            inputConnectorId: inputConnector.id,
            outputConnectorId: outputConnector.id
        };
        inputConnector.connectionId = connection.id;
        currentInputConnections.forEach(function (id) {
            removeConnection(document, id);
        });
        document.connections.push(connection);
        return connection;
    };
    var createNewDocument = function (metaData) {
        var newDocument = {
            id: getId(),
            name: 'New Nodox document',
            connections: [],
            nodes: [],
            metaData: metaData
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
        document.name += '.cloned';
        var oldConnectorIds = {};
        document.nodes.forEach(function (n) {
            var newId = getId();
            oldConnectorIds[n.id] = newId;
            n.id = newId;
            n.inputs.forEach(function (inputConnector) {
                var newInputId = getId();
                inputConnector.nodeId = n.id;
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
    var doesAcceptDataType = function (incomingType, outgoingType) {
        // TODO refine using accepts of datatypes in Module
        // for now: always accept "nodox.core.any"
        if (incomingType === 'nodox.modules.core.any' || outgoingType === 'nodox.modules.core.any')
            return true;
        if (outgoingType === incomingType)
            return true;
        return false;
    };
    var canAcceptConnection = function (sourceConnector, targetConnector) {
        if (sourceConnector.connectorType === targetConnector.connectorType)
            return false;
        if (sourceConnector.nodeId === targetConnector.nodeId)
            return false;
        if (sourceConnector.dataType === targetConnector.dataType)
            return true;
        return doesAcceptDataType(sourceConnector.dataType, targetConnector.dataType);
    };
    var addNode = function (document, definition) {
        var toInputConnector = function (nodeId) { return function (inputDefinition) { return ({
            id: getId(),
            nodeId: nodeId,
            dataType: inputDefinition.dataType,
            name: inputDefinition.name,
            definitionFullName: definition.fullName,
            connectorType: types_1.ConnectorType.input
        }); }; };
        var toOutputConnector = function (nodeId) { return function (outputDefinition) { return ({
            id: getId(),
            connectorType: types_1.ConnectorType.output,
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
            icon: definition.icon
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
    var service = {
        getConnections: getConnections,
        getDefinition: getDefinition,
        addNode: addNode,
        canAcceptConnection: canAcceptConnection,
        connect: connect,
        createNewDocument: createNewDocument,
        deleteNode: deleteNode,
        deleteNodes: deleteNodes,
        fromJson: fromJson,
        getConnector: getConnector,
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
    return service;
};
exports.create = create;
