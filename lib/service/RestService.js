"use strict";
exports.__esModule = true;
var janet_ts_1 = require("janet-ts");
var RestAction_1 = require("../action/RestAction");
var APIClient_1 = require("./APIClient");
var ContentCodec_1 = require("./ContentCodec");
var RestService = (function () {
    function RestService(baseURL) {
        this.apiToken = null;
        this.dispatcher = null;
        this.apiClient = new APIClient_1.APIClient(new ContentCodec_1.JSONSerializer(), new ContentCodec_1.JSONDeserializer());
        this.apiClient.baseURL = baseURL;
    }
    RestService.prototype.setDispatcher = function (dispatcher) {
        this.dispatcher = dispatcher;
    };
    RestService.prototype.dispatch = function (action) {
        var _this = this;
        this.dispatcher(action.set("state", janet_ts_1.ActionState.RUNNING));
        var request = RestAction_1.createHTTPRequestFromAction(action);
        var url = request.url;
        var method = request.method;
        var body = request.body;
        var headers = request.headers;
        headers["Accept"] = "application/json";
        headers["Content-Type"] = "application/json";
        if (this.apiToken != null) {
            headers["Authorization"] = this.apiToken;
        }
        this.apiClient.fetch(url, method, headers, body).then(function (response) {
            var resultAction = action.set("state", janet_ts_1.ActionState.FINISHED).set("result", response.payload);
            _this.dispatcher(resultAction);
        })["catch"](function (error) {
            var resultAction = action.set("state", janet_ts_1.ActionState.FAILED).set("error", error);
            _this.dispatcher(resultAction);
        });
    };
    RestService.prototype.accepts = function (action) {
        return RestAction_1.isHTTPAction(action);
    };
    return RestService;
}());
exports.RestService = RestService;
