"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = /** @class */ (function () {
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
    Point.prototype.assign = function (p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    return Point;
}());
exports.Point = Point;
