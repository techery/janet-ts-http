import {metaKey} from "./RestAction";
export class PropertyAccessor<T> {

  constructor(private key: string) {

  }

  readValue(target: any): T {
    return target[this.key];
  }
}

export class Annotation {
  propertyAccessor: PropertyAccessor<any>;
}

export function makePropertyDecorator(annotation: Annotation): PropertyDecorator {
  return (target: any, propertyKey: any) => {

    let metadata = Reflect.getMetadata(metaKey, target.constructor);

    if (!metadata) {
      metadata = {
        annotations: {}
      };
    }

    if (!metadata.annotations) {
      metadata.annotations = {};
    }

    let annotationName = (annotation.constructor as any).name;

    if (!metadata.annotations[annotationName]) {
      metadata.annotations[annotationName] = [];
    }

    annotation.propertyAccessor = new PropertyAccessor(propertyKey);

    metadata.annotations[annotationName].push(annotation);

    Reflect.defineMetadata(metaKey, metadata, target.constructor);
  };
}

export class BodyAnnotation extends Annotation {

}

export class NamedAnnotation extends Annotation {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class FieldAnnotation extends NamedAnnotation {

}

export class QueryAnnotation extends NamedAnnotation {

}

export class PathParamAnnotation extends NamedAnnotation {

}

export class RequestHeaderAnnotation extends NamedAnnotation {

}

export class ResponseHeaderAnnotation extends NamedAnnotation {

}

export function Body(): PropertyDecorator {
  return makePropertyDecorator(new BodyAnnotation());
}

export function Path(name: string): PropertyDecorator {
  return makePropertyDecorator(new PathParamAnnotation(name));
}

export function Query(name: string): PropertyDecorator {
  return makePropertyDecorator(new QueryAnnotation(name));
}

export function FormField(name: string): PropertyDecorator {
  return makePropertyDecorator(new FieldAnnotation(name));
}

export function RequestHeader(name: string): PropertyDecorator {
  return makePropertyDecorator(new RequestHeaderAnnotation(name));
}

export function ResponseHeader(name: string): PropertyDecorator {
  return makePropertyDecorator(new ResponseHeaderAnnotation(name));
}
