import { Model } from "./model";
import { get } from "lodash-es";

export class BooleanModel extends Model {
    protected element: HTMLInputElement;

    emitValue() {
        this._dispatchValue(this.element.checked);
    }

    receiveState(e: CustomEvent) {
        const state = e.detail;
        const value = get(state, this.directive.prop);

        this.element.checked = value;
    }
}