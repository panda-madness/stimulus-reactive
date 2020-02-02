import { Reactive } from "./reactive";
import { Model, makeModel } from "./models";
import { makeDirective } from "./directives";
import { ModelDirective } from "./directives/model";

export class ReactiveElement {
    private model: Model;

    constructor(element: Element, controller: Reactive) {
        const raw = element.getAttribute(`data-${controller.identifier}`);
        const directives = raw.split(' ').map(str => makeDirective(str));

        directives.forEach(d => {
            if (d instanceof ModelDirective) {
                this.model = makeModel(element, d, controller);
            }
        });
    }

    destroy() {
        this.model.destroy();
    }
}