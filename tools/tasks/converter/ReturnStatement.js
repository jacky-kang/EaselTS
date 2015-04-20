/// <reference path="../node.d.ts" />
/// <reference path="../esprima.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Node = require('./Node');
var ReturnStatement = (function (_super) {
    __extends(ReturnStatement, _super);
    function ReturnStatement(data) {
        _super.call(this, data);
        this.argument = this.getObjectByType(data.argument);
    }
    ReturnStatement.prototype.toString = function () {
        var data = [];
        var expression = this.argument.toString();
        //		data.push(super.toString());
        //		data.push('(');
        data.push('return ');
        data.push(this.argument.toString());
        data.push(';');
        return data.join('');
    };
    return ReturnStatement;
})(Node);
module.exports = ReturnStatement;
