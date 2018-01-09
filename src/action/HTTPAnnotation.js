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
var RestAction_1 = require("./RestAction");
var PropertyAccessor = /** @class */ (function () {
    function PropertyAccessor(key) {
        this.key = key;
    }
    PropertyAccessor.prototype.readValue = function (target) {
        return target[this.key];
    };
    return PropertyAccessor;
}());
exports.PropertyAccessor = PropertyAccessor;
var Annotation = /** @class */ (function () {
    function Annotation() {
    }
    return Annotation;
}());
exports.Annotation = Annotation;
function makePropertyDecorator(annotation) {
    return function (target, propertyKey) {
        var metadata = Reflect.getMetadata(RestAction_1.metaKey, target.constructor);
        if (!metadata) {
            metadata = {
                annotations: {},
            };
        }
        if (!metadata.annotations) {
            metadata.annotations = {};
        }
        var annotationName = annotation.constructor.name;
        if (!metadata.annotations[annotationName]) {
            metadata.annotations[annotationName] = [];
        }
        annotation.propertyAccessor = new PropertyAccessor(propertyKey);
        metadata.annotations[annotationName].push(annotation);
        Reflect.defineMetadata(RestAction_1.metaKey, metadata, target.constructor);
    };
}
exports.makePropertyDecorator = makePropertyDecorator;
var BodyAnnotation = /** @class */ (function (_super) {
    __extends(BodyAnnotation, _super);
    function BodyAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BodyAnnotation;
}(Annotation));
exports.BodyAnnotation = BodyAnnotation;
var NamedAnnotation = /** @class */ (function (_super) {
    __extends(NamedAnnotation, _super);
    function NamedAnnotation(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    return NamedAnnotation;
}(Annotation));
exports.NamedAnnotation = NamedAnnotation;
var FieldAnnotation = /** @class */ (function (_super) {
    __extends(FieldAnnotation, _super);
    function FieldAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldAnnotation;
}(NamedAnnotation));
exports.FieldAnnotation = FieldAnnotation;
var QueryAnnotation = /** @class */ (function (_super) {
    __extends(QueryAnnotation, _super);
    function QueryAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryAnnotation;
}(NamedAnnotation));
exports.QueryAnnotation = QueryAnnotation;
var PathParamAnnotation = /** @class */ (function (_super) {
    __extends(PathParamAnnotation, _super);
    function PathParamAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PathParamAnnotation;
}(NamedAnnotation));
exports.PathParamAnnotation = PathParamAnnotation;
var RequestHeaderAnnotation = /** @class */ (function (_super) {
    __extends(RequestHeaderAnnotation, _super);
    function RequestHeaderAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RequestHeaderAnnotation;
}(NamedAnnotation));
exports.RequestHeaderAnnotation = RequestHeaderAnnotation;
var ResponseHeaderAnnotation = /** @class */ (function (_super) {
    __extends(ResponseHeaderAnnotation, _super);
    function ResponseHeaderAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResponseHeaderAnnotation;
}(NamedAnnotation));
exports.ResponseHeaderAnnotation = ResponseHeaderAnnotation;
function Body() {
    return makePropertyDecorator(new BodyAnnotation());
}
exports.Body = Body;
function Path(name) {
    return makePropertyDecorator(new PathParamAnnotation(name));
}
exports.Path = Path;
function Query(name) {
    return makePropertyDecorator(new QueryAnnotation(name));
}
exports.Query = Query;
function FormField(name) {
    return makePropertyDecorator(new FieldAnnotation(name));
}
exports.FormField = FormField;
function RequestHeader(name) {
    return makePropertyDecorator(new RequestHeaderAnnotation(name));
}
exports.RequestHeader = RequestHeader;
function ResponseHeader(name) {
    return makePropertyDecorator(new ResponseHeaderAnnotation(name));
}
exports.ResponseHeader = ResponseHeader;
