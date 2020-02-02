import { ModelDirective } from "./model";
import { OutputDirective } from "./output";
import { BindDirective } from "./bind";
import { Reactive } from "../reactive";

export interface Directive {
  getProp(): string;
}

export function makeDirective(raw: string) {
  const [directive, body] = raw.split(':');

  switch (directive) {
    case 'model':
      return new ModelDirective(body);
    case 'output':
      return new OutputDirective(body);
    case 'bind':
      return new BindDirective(body);
  }
}