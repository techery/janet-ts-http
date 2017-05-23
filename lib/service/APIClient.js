"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
require("whatwg-fetch");
var NotAuthorizedError = (function (_super) {
    __extends(NotAuthorizedError, _super);
    function NotAuthorizedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotAuthorizedError;
}(Error));
var APIClient = (function () {
    function APIClient(serializer, deserializer) {
        this.serializer = serializer;
        this.deserializer = deserializer;
        this.baseURL = undefined;
    }
    APIClient.prototype.buildURL = function (endpoint) {
        return this.baseURL + endpoint;
    };
    APIClient.prototype.fetch = function (url, method, headers, body) {
        var _this = this;
        var params = {
            method: method,
            mode: 'cors',
            headers: headers
        };
        if (method == "POST" || method == "PUT") {
            params.body = this.serializer.serialize(body);
        }
        return fetch(this.buildURL(url), params).then(function (response) {
            return response.text().then(function (responseString) {
                var payload = _this.deserializer.deserialize(responseString);
                if (response.ok) {
                    return {
                        statusCode: response.status,
                        payload: payload
                    };
                }
                else {
                    switch (response.status) {
                        case 401:
                            throw new NotAuthorizedError(payload.error);
                        default:
                            throw new Error(payload.error);
                    }
                }
            });
        });
    };
    return APIClient;
}());
exports.APIClient = APIClient;
