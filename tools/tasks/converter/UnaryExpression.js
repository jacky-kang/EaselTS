/// <reference path="../node.d.ts" />
/// <reference path="../esprima.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Node = require('./Node');
var UnaryExpression = (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(data) {
        _super.call(this, data);
        this.operator = data.operator;
        this.argument = this.getObjectByType(data.argument);
        this.prefix = data.prefix;
    }
    UnaryExpression.prototype.toString = function () {
        return this.operator + this.argument.toString();
    };
    return UnaryExpression;
})(Node);
module.exports = UnaryExpression;
