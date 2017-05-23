export interface Serializer {
    serialize(content: any): any;
}
export interface Deserializer {
    deserialize(content: any): any;
}
export declare class JSONSerializer implements Serializer {
    serialize(content: any): any;
}
export declare class JSONDeserializer implements Deserializer {
    deserialize(content: any): any;
}
