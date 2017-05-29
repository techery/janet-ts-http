"use strict";
exports.__esModule = true;
var janet_ts_1 = require("janet-ts");
var RestAction_1 = require("../action/RestAction");
var APIClient_1 = require("./APIClient");
var ContentCodec_1 = require("./ContentCodec");
var RestService = (function () {
    function RestService(baseURL, tokenProvider) {
        this.tokenProvider = tokenProvider;
        this.apiClient = new APIClient_1.APIClient(new ContentCodec_1.JSONSerializer(), new ContentCodec_1.JSONDeserializer());
        this.apiClient.baseURL = baseURL;
    }
    RestService.prototype.dispatch = function (actionHolder, dispatcher) {
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
        this.apiClient.fetch(url, method, headers, body).then(function (response) {
            dispatcher(janet_ts_1.finishAction(actionHolder.action, response.payload));
        })["catch"](function (error) {
            dispatcher(janet_ts_1.failAction(actionHolder.action, error));
        });
    };
    RestService.prototype.accepts = function (action) {
        return RestAction_1.isHTTPAction(action);
    };
    return RestService;
}());
exports.RestService = RestService;
