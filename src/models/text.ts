import { Model } from "./model";
import { get } from "lodash-es";

export class TextModel extends Model {
    protected element: HTMLInputElement | HTMLTextAreaElement;
    
    protected getEventName() {
        return this.directive.isLazy() ? 'change' : 'input';
    }

    emitValue(e: Event) {
        const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;

        this._dispatchValue(target.value);
    }

    receiveState(e: CustomEvent) {
        const state = e.detail;
        this.element.value = get(state, this.directive.prop, null);
    }
}