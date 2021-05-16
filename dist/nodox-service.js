"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.REASON_CIRCULAR_DEPENDENCY = exports.REASON_DATATYPE_MISMATCH = exports.REASON_IDENTICAL_PARENT_NODE = exports.REASON_IDENTICAL_CONNECTOR_TYPES = exports.uuidIdProvider = void 0;
var uuid_1 = require("uuid");
var types_1 = require("./types");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var uuidIdProvider = function () { return uuid_1.v4(); };
exports.uuidIdProvider = uuidIdProvider;
exports.REASON_IDENTICAL_CONNECTOR_TYPES = 'identical connector types';
exports.REASON_IDENTICAL_PARENT_NODE = 'identical parent node';
exports.REASON_DATATYPE_MISMATCH = 'dataTypes do not match';
exports.REASON_CIRCULAR_DEPENDENCY = 'circular dependency';
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
                throw new Error("duplicate definition (" + definition.fullName + "): " + module.name);
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
    var getUpstreamNodeIds = function (document, nodeId) {
        var toUpstreamNodeIds = function (list, input) {
            var outputNodeId = getConnection(document, input.connectionId).outputNodeId;
            var result = __spreadArray(__spreadArray(__spreadArray([], list), [outputNodeId]), getUpstreamNodeIds(document, outputNodeId));
            return result;
        };
        var hasConnection = function (input) { return input.connectionId !== undefined; };
        var node = getNode(document, nodeId);
        return node === undefined
            ? []
            : node
                .inputs
                .filter(hasConnection)
                .reduce(toUpstreamNodeIds, []);
    };
    var getInput = function (document, inputId) {
        var node = document.nodes.find(function (node) { return node.inputs.find(byId(inputId)) !== undefined; });
        return { node: node, connector: node === null || node === void 0 ? void 0 : node.inputs.find(byId(inputId)) };
    };
    var getOutput = function (document, outputId) {
        var node = document.nodes.find(function (node) { return node.outputs.find(byId(outputId)) !== undefined; });
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
            var index = document.connections.indexOf(connection);
            if (index > -1) {
                document.connections.splice(index, 1);
            }
        }
    };
    var connectorPair = function (firstConnector, secondConnector) {
        if (firstConnector.connectorType === secondConnector.connectorType) {
            return {};
        }
        var _a = firstConnector.connectorType === types_1.ConnectorType.input
            ? [firstConnector, secondConnector]
            : [secondConnector, firstConnector], inputConnector = _a[0], outputConnector = _a[1];
        return { inputConnector: inputConnector, outputConnector: outputConnector };
    };
    var doesAcceptDataType = function (inputType, outputType) {
        var inputPathSegments = inputType.split('.').reverse();
        var outputPathSegments = outputType.split('.').reverse();
        var lastPathIsAny = inputPathSegments[0] === 'any' || outputPathSegments[0] === 'any';
        var restPathsAreEqual = inputPathSegments.slice(1).join('.') === outputPathSegments.slice(1).join('.');
        switch (true) {
            case inputType === 'nodox.modules.core.any' || outputType === 'nodox.modules.core.any': return true;
            case outputType === inputType: return true;
            case lastPathIsAny && restPathsAreEqual: return true;
            default: return false;
        }
    };
    var canAcceptConnection = function (document, firstConnector, secondConnector) {
        var _a = connectorPair(firstConnector, secondConnector), input = _a.inputConnector, output = _a.outputConnector;
        switch (true) {
            case input === undefined || output === undefined: return { canConnect: false, reason: exports.REASON_IDENTICAL_CONNECTOR_TYPES };
            case input.nodeId === output.nodeId: return { canConnect: false, reason: exports.REASON_IDENTICAL_PARENT_NODE };
            case !doesAcceptDataType(input.dataType, output.dataType): return { canConnect: false, reason: exports.REASON_DATATYPE_MISMATCH };
            case getUpstreamNodeIds(document, output.nodeId).includes(input.nodeId): return { canConnect: false, reason: exports.REASON_CIRCULAR_DEPENDENCY };
        }
        return { canConnect: true };
    };
    var connect = function (document, firstConnector, secondConnector) {
        var _a = connectorPair(firstConnector, secondConnector), input = _a.inputConnector, output = _a.outputConnector;
        if (input !== undefined && output !== undefined) {
            var canConnect = canAcceptConnection(document, input, output).canConnect;
            if (!canConnect) {
                return undefined;
            }
            var currentInputConnections = document
                .connections
                .filter(function (connection) { return connection.inputConnectorId === input.id; })
                .map(function (connection) { return connection.id; });
            var connection = {
                id: getId(),
                inputConnectorId: input.id,
                outputConnectorId: output.id,
                inputNodeId: input.nodeId,
                outputNodeId: output.nodeId
            };
            currentInputConnections.forEach(function (id) {
                removeConnection(document, id);
            });
            input.connectionId = connection.id;
            document.connections.push(connection);
            return connection;
        }
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
        nodes.forEach(function (node) { return deleteNode(document, node); });
    };
    var deleteNode = function (document, node) {
        var isConnected = function (connection) { return node
            .inputs
            .map(function (input) { return input.connectionId; })
            .includes(connection.id); };
        var remove = function (connection) { return removeConnection(document, connection.id); };
        document.connections
            .filter(isConnected)
            .forEach(remove);
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
