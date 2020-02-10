import {ValueModel} from "./base";

export class Simple extends ValueModel {
    protected element: HTMLInputElement | HTMLTextAreaElement;

    get(): any {
        return this.element.value;
    }

    set(value: any): void {
        this.element.value = String(value);
    }

    bind() {
        const event = this.rm.isLazy() ? 'change' : 'input';
        this.element.addEventListener(event, this.dispatch);
    }

    unbind() {
        const event = this.rm.isLazy() ? 'change' : 'input';
        this.element.removeEventListener(event, this.dispatch);
    }
}