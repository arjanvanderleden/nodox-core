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
exports.Core = void 0;
var _1 = require(".");
var types_1 = require("../../types");
var nodox_module_base_1 = require("../nodox-module-base");
var Core = /** @class */ (function (_super) {
    __extends(Core, _super);
    function Core() {
        var _this = _super.call(this) || this;
        _this.name = 'Core';
        _this.description = 'Core definitions for Nodox';
        _this.namespace = types_1.CORE_MODULE_NAMESPACE;
        _this.dependencies = [];
        _this.dataTypes = [
            {
                name: 'number',
                description: 'Javascript number',
                accepts: []
            },
            {
                name: 'string',
                description: 'Javascript string',
                accepts: ['*']
            },
            {
                name: 'boolean',
                description: 'boolean',
                accepts: ['*']
            },
            {
                name: 'any',
                description: 'Anything',
                accepts: ['*']
            }
        ];
        _this.definitions = [
            _1.addDefinition,
            _1.randomDefinition,
            _1.maxDefinition,
            _1.minDefinition,
            _1.listSortDefinition,
            _1.listReverse
        ];
        return _this;
    }
    return Core;
}(nodox_module_base_1.NodoxModuleBase));
exports.Core = Core;
