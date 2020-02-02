import { Model } from "models";
import { ModelDirective } from "directives/model";
import { Reactive } from "../reactive";
import { get } from "lodash-es";

export class TextModel implements Model {
    private element: HTMLInputElement | HTMLTextAreaElement;
    private directive: ModelDirective;
    private controller: Reactive;

    constructor(element: HTMLInputElement | HTMLTextAreaElement, directive: ModelDirective, controller: Reactive) {
        this.element = element;
        this.controller = controller;
        this.directive = directive;

        this.emitValue = this.emitValue.bind(this);
        this.receiveState = this.receiveState.bind(this);

        const event = this.directive.isLazy() ? 'change' : 'input';

        this.element.addEventListener(event, this.emitValue);

        this.controller.element.addEventListener(`${this.controller.identifier}:state`, this.receiveState);
    }

    emitValue(e: Event) {
        const event = `${this.controller.identifier}:value`;
        const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;

        this.element.dispatchEvent(
            new CustomEvent(event, {
                bubbles: true,
                detail: {
                    prop: this.directive.prop,
                    value: target.value,
                }
            })
        );
    }

    receiveState(e: CustomEvent) {
        const state = e.detail;

        this.element.value = get(state, this.directive.prop, null);
    }

    destroy() {
        const event = this.directive.isLazy() ? 'change' : 'input';
        this.element.removeEventListener(event, this.emitValue);
        this.controller.element.removeEventListener(`${this.controller.identifier}:state`, this.receiveState);
    }
}