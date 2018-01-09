"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSONSerializer = /** @class */ (function () {
    function JSONSerializer() {
    }
    JSONSerializer.prototype.serialize = function (content) {
        return JSON.stringify(content);
    };
    return JSONSerializer;
}());
exports.JSONSerializer = JSONSerializer;
