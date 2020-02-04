import {Model} from "./model";
import {get} from "lodash-es";

export class CheckboxArrayModel extends Model {
  protected element: HTMLInputElement;

  emitValue(): void {
    const id = this.controller.identifier;
    const prop = this.directive.prop;

    const group: NodeListOf<HTMLInputElement> = this.controller.element.querySelectorAll(
        `input[type="checkbox"][data-${id}*="model:${prop}"]`
    );

    const value = Array.from(group)
        .filter(c => c.checked)
        .reduce((acc: string[], current) => {
          acc.push(current.value);
          return acc;
        }, []);

    this._dispatchValue(value);
  }

  receiveState(e: CustomEvent): void {
    const prop = this.directive.prop;

    const values: string[] = get(e.detail, prop) ?? [];

    this.element.checked = values.indexOf(this.element.value) > -1;
  }
}