export declare class PropertyAccessor<T> {
    private key;
    constructor(key: string);
    readValue(target: any): T;
}
export declare class Annotation {
    propertyAccessor: PropertyAccessor<any>;
}
export declare function makePropertyDecorator(annotation: Annotation): PropertyDecorator;
export declare class BodyAnnotation extends Annotation {
}
export declare class NamedAnnotation extends Annotation {
    readonly name: string;
    constructor(name: string);
}
export declare class FieldAnnotation extends NamedAnnotation {
}
export declare class QueryAnnotation extends NamedAnnotation {
}
export declare class PathParamAnnotation extends NamedAnnotation {
}
export declare class RequestHeaderAnnotation extends NamedAnnotation {
}
export declare class ResponseHeaderAnnotation extends NamedAnnotation {
}
export declare function Body(): PropertyDecorator;
export declare function Path(name: string): PropertyDecorator;
export declare function Query(name: string): PropertyDecorator;
export declare function FormField(name: string): PropertyDecorator;
export declare function RequestHeader(name: string): PropertyDecorator;
export declare function ResponseHeader(name: string): PropertyDecorator;
