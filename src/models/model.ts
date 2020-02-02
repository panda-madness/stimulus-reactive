export abstract class Model {
    protected element: Element;
    protected controller: Reactive;
    protected directive: ModelDirective;

    abstract emitValue(e: CustomEvent): void;
    abstract receiveState(e: CustomEvent): void;

    protected getEventName() {
        return 'change';
    }

    protected _dispatchValue(value: any) {
        this.element.dispatchEvent(new CustomEvent(`${this.controller.identifier}:value`, {
            bubbles: true,
            detail: {
                prop: this.directive.prop,
                value: value,
            }
        }));
    }

    constructor(element: Element, directive: ModelDirective, controller: Reactive) {
        this.element = element;
        this.controller = controller;
        this.directive = directive;

        this.emitValue = this.emitValue.bind(this);
        this.receiveState = this.receiveState.bind(this);

        this.controller.element.addEventListener(`${this.controller.identifier}:state`, this.receiveState);

        const event = this.getEventName();
        this.element.addEventListener(event, this.emitValue);
    }

    destroy() {
        const event = this.getEventName();
        this.element.removeEventListener(event, this.emitValue);
        this.controller.element.removeEventListener(`${this.controller.identifier}:state`, this.receiveState);
    }
}