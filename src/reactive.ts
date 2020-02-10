import {ReactiveController} from "./reactive_controller";

export abstract class Reactive {
    readonly element: Element;
    readonly directive: string;
    readonly controller: ReactiveController;

    constructor(element: Element, directive: string, controller: ReactiveController) {
        this.element = element;
        this.directive = directive;
        this.controller = controller;
    }

    abstract destroy(): void;
}