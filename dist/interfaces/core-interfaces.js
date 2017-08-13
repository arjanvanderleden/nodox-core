"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectorType;
(function (ConnectorType) {
    ConnectorType[ConnectorType["Input"] = 0] = "Input";
    ConnectorType[ConnectorType["Output"] = 1] = "Output";
})(ConnectorType = exports.ConnectorType || (exports.ConnectorType = {}));
var NodeProcessingMode;
(function (NodeProcessingMode) {
    NodeProcessingMode[NodeProcessingMode["Wrap"] = 0] = "Wrap";
    NodeProcessingMode[NodeProcessingMode["AddNull"] = 1] = "AddNull";
    NodeProcessingMode[NodeProcessingMode["Stop"] = 2] = "Stop";
})(NodeProcessingMode = exports.NodeProcessingMode || (exports.NodeProcessingMode = {}));
