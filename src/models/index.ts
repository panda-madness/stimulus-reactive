import { ModelDirective } from "../directives/model";
import { TextModel } from "./text";
import { Reactive } from "../reactive";

export interface Model {
    destroy(): void;
}

export function makeModel(element: Element, directive: ModelDirective, controller: Reactive): Model {
    if (element instanceof HTMLTextAreaElement) {
        return new TextModel(element, directive, controller);
    }

    const types = [
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

    if (element instanceof HTMLInputElement && types.indexOf(element.type) !== -1) {
        return new TextModel(element, directive, controller);
    }
}
