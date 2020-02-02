export class ModelDirective {
  prop: string;
  args: string[];

  constructor(raw: string) {
    const [prop, ...args] = raw.split('|');
    this.prop = prop;
    this.args = args;
  }

  public isLazy() {
    return this.args.indexOf('lazy') > -1;
  }
}