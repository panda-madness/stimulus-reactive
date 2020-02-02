import { Reactive } from "reactive";

export class RadioModel {
    private element: HTMLInputElement;
    private prop: string;
    private controller: Reactive;

    constructor(element: HTMLInputElement, prop: string, controller: Reactive) {
        if (element.type !== 'radio') {
            throw new Error('Element of RadioModel must be a radio button');
        }

        this.element = element;
        this.prop = prop;
        this.controller = controller;
    }

    getValue(): any 
    {
        const radio: HTMLInputElement = this.controller.element.querySelector(
            `input[type="radio" data-${this.controller.identifier}="model:${this.prop}"]:checked`
        );

        if (!radio) {
            return null;
        }

        return radio.value;
    }

    setValue(val: string): void
    {
        const group: NodeListOf<HTMLInputElement> = this.controller.element.querySelectorAll(
            `input[type="radio" data-${this.controller.identifier}="model:${this.prop}"]`
        );

        group.forEach($el => {
            this.element.checked = false;
        });

        Array.from(group).find(el => el.value === val).checked = true;
    }
}