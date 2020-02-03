import { Model } from "./model";
import { get } from "lodash-es";

export class RadioModel extends Model {
    protected element: HTMLInputElement;

    emitValue(e?: Event): any 
    {
        if (e && e.type === 'change') {
            const id = this.controller.identifier;
            const prop = this.directive.prop;

            const group: NodeListOf<HTMLInputElement> = this.controller.element.querySelectorAll(
                `input[type="radio"][data-${id}*="model:${prop}"]`
            );

            Array.from(group).filter(r => r.value === this.element.value).forEach(r => r.checked = true);
            Array.from(group).filter(r => r.value !== this.element.value).forEach(r => r.checked = false);
            this._dispatchValue(this.element.value);
            return;
        }

        if (this.element.checked) {
            this._dispatchValue(this.element.value);
        }
    }

    receiveState(e: CustomEvent): void
    {
        const prop = this.directive.prop;
        const val = get(e.detail, prop);

        this.element.checked = val === this.element.value;
    }
}