import { Model } from "./model";
import { get } from "lodash-es";

export class RadioModel extends Model {
    protected element: HTMLInputElement;

    emitValue(e: Event): any 
    {
        const id = this.controller.identifier;
        const prop = this.directive.prop;
        const target = e.currentTarget as HTMLInputElement;

        const group: NodeListOf<HTMLInputElement> = this.controller.element.querySelectorAll(
            `input[type="radio"][data-${id}*="model:${prop}"]`
        );

        Array.from(group).forEach(r => r.checked = false);
        Array.from(group).filter(r => r.value === target.value).forEach(r => r.checked = true);

        this._dispatchValue(target.value);
    }

    receiveState(e: CustomEvent): void
    {
        const id = this.controller.identifier;
        const prop = this.directive.prop;
        const val = get(e.detail, prop);
        
        const group: NodeListOf<HTMLInputElement> = this.controller.element.querySelectorAll(
            `input[type="radio"][data-${id}*="model:${prop}"]`
        );

        group.forEach($el => {
            this.element.checked = false;
        });

        Array.from(group).filter(el => el.value === val).forEach(r => r.checked = true);
    }
}