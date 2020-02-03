import { Reactive } from "../reactive";
import { ModelDirective } from "../directives/model";

export abstract class Model {
    protected element: Element;
    protected controller: Reactive;
    protected directive: ModelDirective;

    abstract emitValue(): void;
    abstract receiveState(e: CustomEvent): void;

    protected getEventName() {
        return 'change';
    }

    protected _dispatchValue(value: any) {
        const event = new CustomEvent(`${this.controller.identifier}:value`, {
            bubbles: true,
            detail: {
                prop: this.directive.prop,
                value: value,
            }
        });

        this.element.dispatchEvent(event);
    }

    constructor(element: Element, directive: ModelDirective, controller: Reactive) {
        this.element = element;
        this.controller = controller;
        this.directive = directive;

        this.emitValue = this.emitValue.bind(this);
        this.receiveState = this.receiveState.bind(this);
        
        this.element.addEventListener(this.getEventName(), this.emitValue);
        this.controller.element.addEventListener(`${this.controller.identifier}:state`, this.receiveState);
        this.controller.element.addEventListener(`${this.controller.identifier}:bootstrap`, this.emitValue);
    }

    destroy() {
        this.element.removeEventListener(this.getEventName(), this.emitValue);
        this.controller.element.removeEventListener(`${this.controller.identifier}:state`, this.receiveState);
        this.controller.element.removeEventListener(`${this.controller.identifier}:bootstrap`, this.emitValue);
    }
}