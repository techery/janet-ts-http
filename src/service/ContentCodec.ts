export interface Serializer {
  serialize(content: any): any;
}

export class JSONSerializer implements Serializer {
  public serialize(content: any): any {
    return JSON.stringify(content);
  }
}
