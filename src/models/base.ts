import {ReactiveModel} from "../reactive_model";
import {ValueEvent} from "../util";

export abstract class ValueModel {
    protected element: Element;
    protected rm: ReactiveModel;

    constructor(rm: ReactiveModel) {
        this.element = rm.element;
        this.rm = rm;
        this.dispatch = this.dispatch.bind(this);
        this.bind();
    }

    dispatch() {
        const id = this.rm.controller.identifier;
        const event = new ValueEvent(`${id}:value`);
        this.element.dispatchEvent(event);
    }

    abstract get(): any;
    abstract set(value: any): void;
    abstract bind(): void;
    abstract unbind(): void;
}