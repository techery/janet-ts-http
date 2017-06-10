"use strict";
exports.__esModule = true;
var RestAction_1 = require("../action/RestAction");
var APIClient_1 = require("./APIClient");
var ContentCodec_1 = require("./ContentCodec");
var RestService = (function () {
    function RestService(baseURL, tokenProvider) {
        this.tokenProvider = tokenProvider;
        this.apiClient = new APIClient_1.APIClient(new ContentCodec_1.JSONSerializer(), new ContentCodec_1.JSONDeserializer());
        this.apiClient.baseURL = baseURL;
    }
    RestService.prototype.connect = function (dispatcher, executor) {
    };
    RestService.prototype.dispatch = function (actionHolder) {
        var request = RestAction_1.createHTTPRequestFromAction(actionHolder.action);
        var url = request.url;
        var method = request.method;
        var body = request.body;
        var headers = request.headers;
        headers["Accept"] = "application/json";
        headers["Content-Type"] = "application/json";
        var token = this.tokenProvider();
        if (token) {
            headers["Authorization"] = token;
        }
        return this.apiClient.fetch(url, method, headers, body).then(function (response) {
            return response.payload;
        })["catch"](function (error) {
            return error;
        });
    };
    RestService.prototype.accepts = function (action) {
        return RestAction_1.isHTTPAction(action);
    };
    return RestService;
}());
exports.RestService = RestService;
