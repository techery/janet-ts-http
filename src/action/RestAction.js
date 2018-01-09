"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var janet_ts_1 = require("janet-ts");
var HTTPAnnotation_1 = require("./HTTPAnnotation");
__export(require("./HTTPAnnotation"));
exports.metaKey = "META::HTTPAction";
function extractRequestInfo(httpAction) {
    return Reflect.getMetadata(exports.metaKey, httpAction.constructor);
}
function extractFields(requestInfo, annotationType) {
    var annotations = requestInfo.annotations[annotationType.name];
    if (annotations) {
        return annotations;
    }
    else {
        return [];
    }
}
function extractField(requestInfo, annotationType) {
    var annotations = extractFields(requestInfo, annotationType);
    if (annotations[0]) {
        return annotations[0];
    }
    else {
        return null;
    }
}
function isHTTPAction(httpAction) {
    var requestInfo = extractRequestInfo(httpAction);
    return requestInfo != null;
}
exports.isHTTPAction = isHTTPAction;
function parseHTTPAction(httpAction) {
    var requestInfo = extractRequestInfo(httpAction);
    if (requestInfo == null) {
        throw new Error("Invalid HTTP Action:" + httpAction);
    }
    var body = extractField(requestInfo, HTTPAnnotation_1.BodyAnnotation);
    return {
        url: requestInfo.url,
        method: requestInfo.method,
        formFields: extractFields(requestInfo, HTTPAnnotation_1.FieldAnnotation),
        queryParams: extractFields(requestInfo, HTTPAnnotation_1.QueryAnnotation),
        pathParams: extractFields(requestInfo, HTTPAnnotation_1.PathParamAnnotation),
        requestHeaders: extractFields(requestInfo, HTTPAnnotation_1.RequestHeaderAnnotation),
        responseHeaders: extractFields(requestInfo, HTTPAnnotation_1.ResponseHeaderAnnotation),
        body: body,
    };
}
exports.parseHTTPAction = parseHTTPAction;
function applyPathParams(url, params) {
    var updatedURL = url;
    params.forEach(function (pathParam) {
        updatedURL = updatedURL.replace("{" + pathParam.name + "}", pathParam.value);
    });
    return updatedURL;
}
function applyQueryParams(url, params) {
    if (params.length > 0) {
        var queryPairs = params.map(function (param) {
            return param.name + "=" + param.value;
        });
        return url + "?" + queryPairs.join("&");
    }
    else {
        return url;
    }
}
function toHash(values) {
    var hash = {};
    values.forEach(function (value) {
        hash[value.name] = value.value;
    });
    return hash;
}
function createHTTPRequestFromScheme(httpAction, scheme) {
    var toParams = function (annotation) {
        return {
            name: annotation.name,
            value: annotation.propertyAccessor.readValue(httpAction),
        };
    };
    var pathParams = scheme.pathParams.map(toParams);
    var queryParams = scheme.queryParams.map(toParams);
    var headers = toHash(scheme.requestHeaders.map(toParams));
    var formFields = scheme.formFields.map(toParams);
    var body = scheme.body != null ? scheme.body.propertyAccessor.readValue(httpAction) : null;
    if (!body && formFields.length > 0) {
        body = {};
        formFields.forEach(function (param) {
            body[param.name] = param.value;
        });
    }
    var url = applyPathParams(scheme.url, pathParams);
    url = applyQueryParams(url, queryParams);
    return {
        url: url,
        method: scheme.method,
        queryParams: queryParams,
        headers: headers,
        body: body,
    };
}
exports.createHTTPRequestFromScheme = createHTTPRequestFromScheme;
function createHTTPRequestFromAction(httpAction) {
    var scheme = parseHTTPAction(httpAction);
    return createHTTPRequestFromScheme(httpAction, scheme);
}
exports.createHTTPRequestFromAction = createHTTPRequestFromAction;
function HttpAction(url, method) {
    if (method === void 0) { method = "GET"; }
    return function (target) {
        var metadata = Reflect.getMetadata(exports.metaKey, target);
        if (!metadata) {
            metadata = {
                annotations: {},
            };
        }
        metadata.url = url;
        metadata.method = method;
        Reflect.defineMetadata(exports.metaKey, metadata, target);
        return janet_ts_1.action(target);
    };
}
exports.HttpAction = HttpAction;
