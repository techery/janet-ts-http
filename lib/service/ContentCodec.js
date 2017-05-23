"use strict";
exports.__esModule = true;
var JSONSerializer = (function () {
    function JSONSerializer() {
    }
    JSONSerializer.prototype.serialize = function (content) {
        return JSON.stringify(content);
    };
    return JSONSerializer;
}());
exports.JSONSerializer = JSONSerializer;
var JSONDeserializer = (function () {
    function JSONDeserializer() {
    }
    JSONDeserializer.prototype.deserialize = function (content) {
        return JSON.parse(content);
    };
    return JSONDeserializer;
}());
exports.JSONDeserializer = JSONDeserializer;
