import { Model } from "./model";
import { get } from "lodash-es";

export class TextModel extends Model {
    protected element: HTMLInputElement | HTMLTextAreaElement;
    
    protected getEventName() {
        return this.directive.isLazy() ? 'change' : 'input';
    }

    emitValue() {
        this._dispatchValue(this.element.value);
    }

    receiveState(e: CustomEvent) {
        const state = e.detail;
        this.element.value = get(state, this.directive.prop, null);
    }
}