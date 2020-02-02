export class BindDirective {
  prop: string;
  attr: string;
  modifiers: string[];

  constructor(raw: string) {
    const [prop, rest] = raw.split('#');
    this.prop = prop;

    const [attr, ...modifiers] = rest.split('.');

    this.attr = attr;
    this.modifiers = modifiers;
  }
}