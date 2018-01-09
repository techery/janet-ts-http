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
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-deep-module-imports */
// tslint:disable:max-params
require("whatwg-fetch");
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        return _this;
    }
    return APIError;
}(Error));
exports.APIError = APIError;
var APIFormError = /** @class */ (function () {
    function APIFormError(errors, statusCode) {
        this.message = "Form validation error";
        this.statusCode = statusCode;
        this.fieldErrors = errors;
    }
    APIFormError.prototype.getByField = function (name) {
        if (!this.fieldErrors) {
            return "";
        }
        var fieldError = this.fieldErrors[name];
        if (!fieldError) {
            return "";
        }
        return fieldError.map(function (message) {
            return message;
        }).toString();
    };
    return APIFormError;
}());
exports.APIFormError = APIFormError;
var defaultAPICallWrapper = function (call) {
    return call();
};
var APIClient = /** @class */ (function () {
    function APIClient(baseURL, serializer, responseMapper, apiCallWrapper) {
        if (apiCallWrapper === void 0) { apiCallWrapper = defaultAPICallWrapper; }
        this.baseURL = baseURL;
        this.serializer = serializer;
        this.responseMapper = responseMapper;
        this.apiCallWrapper = apiCallWrapper;
    }
    APIClient.prototype.fetch = function (url, method, headers, body) {
        var _this = this;
        return this.apiCallWrapper(function () {
            return _this.execFetch(url, method, headers, body);
        });
    };
    APIClient.prototype.buildURL = function (endpoint) {
        if (endpoint.startsWith("http")) {
            return endpoint;
        }
        else {
            return this.baseURL + endpoint;
        }
    };
    APIClient.prototype.execFetch = function (url, method, headers, body) {
        var params = {
            method: method,
            mode: "cors",
            headers: headers,
            cache: "default",
        };
        if (method === "POST" || method === "PUT") {
            params.body = this.serializer.serialize(body);
        }
        return fetch(this.buildURL(url), params).then(this.responseMapper);
    };
    return APIClient;
}());
exports.APIClient = APIClient;
