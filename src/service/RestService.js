"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RestAction_1 = require("../action/RestAction");
var APIClient_1 = require("./APIClient");
var ContentCodec_1 = require("./ContentCodec");
var RestService = /** @class */ (function () {
    function RestService(baseURL, tokenProvider, responseMapper, apiCallWrapper) {
        this.tokenProvider = tokenProvider;
        this.apiClient = new APIClient_1.APIClient(baseURL, new ContentCodec_1.JSONSerializer(), responseMapper, apiCallWrapper);
    }
    RestService.prototype.connect = function (dispatcher, executor) {
        // Empty
    };
    RestService.prototype.dispatch = function (actionHolder) {
        var request = RestAction_1.createHTTPRequestFromAction(actionHolder.action);
        var url = request.url;
        var method = request.method;
        var body = request.body;
        var headers = request.headers;
        headers["Accept"] = headers["Accept"] || "application/json";
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
        var skipAuth = request.headers["Accept"] !== "application/json";
        var token = this.tokenProvider();
        if (token && !skipAuth) {
            headers["Authorization"] = token;
        }
        return this.apiClient.fetch(url, method, headers, body).then(function (response) {
            return response.payload;
        });
    };
    RestService.prototype.accepts = function (action) {
        return RestAction_1.isHTTPAction(action);
    };
    return RestService;
}());
exports.RestService = RestService;
