import { Model } from './model'
import { ModelDirective } from "../directives/model";
import { TextModel } from "./text";
import { RadioModel } from "./radio";
import { BooleanModel } from "./boolean";
import { Reactive } from "../reactive";

export function makeModel(element: Element, directive: ModelDirective, controller: Reactive): Model {
    if (element instanceof HTMLTextAreaElement) {
        return new TextModel(element, directive, controller);
    }

    const textTypes = [
        'text',
        'email',
        'number',
        'password',
        'color',
        'date',
        'datetime-local',
        'hidden',
        'month',
        'range',
        'search',
        'tel',
        'time',
        'url',
        'week'
    ];

    if (element instanceof HTMLInputElement && textTypes.indexOf(element.type) !== -1) {
        return new TextModel(element, directive, controller);
    }

    if (element instanceof HTMLInputElement && element.type === 'radio') {
        return new RadioModel(element, directive, controller);
    }

    const checkboxSelector = `input[type="checkbox"][data-${controller.identifier}*="model:${directive.prop}"]`;
    const checkboxGroup = controller.element.querySelectorAll(checkboxSelector);

    if (
        element instanceof HTMLInputElement &&
        element.type === 'checkbox' &&
        checkboxGroup.length === 1
    ) {
        return new BooleanModel(element, directive, controller);
    }
}
