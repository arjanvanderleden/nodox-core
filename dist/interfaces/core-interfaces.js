"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeProcessingMode = exports.ConnectorType = void 0;
var ConnectorType;
(function (ConnectorType) {
    ConnectorType["input"] = "input";
    ConnectorType["output"] = "output";
})(ConnectorType = exports.ConnectorType || (exports.ConnectorType = {}));
var NodeProcessingMode;
(function (NodeProcessingMode) {
    NodeProcessingMode["wrap"] = "wrap";
    NodeProcessingMode["addNull"] = "add-null";
    NodeProcessingMode["stop"] = "stop";
})(NodeProcessingMode = exports.NodeProcessingMode || (exports.NodeProcessingMode = {}));
