import { Directive } from "directives";

export class OutputDirective implements Directive {
  private prop: string;
  private args: string[];

  constructor(raw: string) {
    const [prop, ...args] = raw.split('.');

    this.prop = prop;
    this.args = args;
  }

  isHtml() {
    return this.args.indexOf('html') !== -1;
  }

  getProp() {
    return this.prop;
  }
}