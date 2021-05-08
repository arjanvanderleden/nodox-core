"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeProcessingMode = exports.InputExhaustedError = exports.ConnectorType = void 0;
var ConnectorType;
(function (ConnectorType) {
    ConnectorType["input"] = "input";
    ConnectorType["output"] = "output";
})(ConnectorType = exports.ConnectorType || (exports.ConnectorType = {}));
var InputExhaustedError = /** @class */ (function (_super) {
    __extends(InputExhaustedError, _super);
    function InputExhaustedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InputExhaustedError;
}(Error));
exports.InputExhaustedError = InputExhaustedError;
;
/**
 * defines what a node should do during processing
 * when one the input has not enough values to provide
 * for the values if onother input
 * possible values are:
 * - wrap: start using values from the start (the output length is the length of the longest input)
 * - addEmpty: use value undefined (the output length is the length of the longest input)
 * - stop: stop processing values (the output length is the length of the shortest input)
 * - throw: throw InputExhaustedError (processing is aborted by an exception)
 */
var NodeProcessingMode;
(function (NodeProcessingMode) {
    NodeProcessingMode["wrap"] = "wrap";
    NodeProcessingMode["addEmpty"] = "add-empty";
    NodeProcessingMode["stop"] = "stop";
    NodeProcessingMode["throw"] = "throw";
})(NodeProcessingMode = exports.NodeProcessingMode || (exports.NodeProcessingMode = {}));
