export interface Serializer {
  serialize(content: any): any;
}

export interface Deserializer {
  deserialize(content: any): any;
}

export class JSONSerializer implements Serializer {

  serialize(content: any): any {
    return JSON.stringify(content);
  }
}

export class JSONDeserializer implements Deserializer {
  deserialize(content: any): any {
    try {
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  }
}
