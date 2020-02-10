import {ReactiveController} from "./reactive_controller";
import {ReactiveModel} from "./reactive_model";
import {Simple} from "./models/simple";

export function makeReactive(element: Element, directive: string, controller: ReactiveController) {
    if (directive.startsWith('model')) {
        return new ReactiveModel(element, directive, controller);
    }

    if (directive.startsWith('bind')) {

    }

    if (directive.startsWith('output')) {

    }

    return null;
}

export function makeValueModel(rm: ReactiveModel) {
    if (rm.element instanceof HTMLTextAreaElement) {
        return new Simple(rm);
    }

    const textTypes = ['text', 'number', 'password', 'color', 'email'];

    if (
        rm.element instanceof HTMLInputElement &&
        textTypes.indexOf(rm.element.type) !== -1)
    {
        return new Simple(rm);
    }
}

export function parseModelDirective(raw: string) {
    const [dir, rest] = raw.split(':');
    const [key, ...modifiers] = rest.split('|');
    return {key, modifiers};
}

export class UpdateEvent extends CustomEvent<{ key: string, value: any }> {
    constructor(type: string, key: string, value: any) {
        super(type, {
            bubbles: true,
            detail: {key, value},
        });
    }
}

export class ValueEvent extends CustomEvent<any> {
    constructor(type: string) {
        super(type, {bubbles: false});
    }
}

export interface ParsedModelDirective {
    key: string,
    modifiers: string[]
}