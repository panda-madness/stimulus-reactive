import {Reactive} from "./reactive";
import {ReactiveController} from "./reactive_controller";
import {makeValueModel, ParsedModelDirective, parseModelDirective, UpdateEvent} from "./util";
import {ValueModel} from "./models/base";

export class ReactiveModel extends Reactive {
    readonly parsed: ParsedModelDirective;
    readonly valueModel: ValueModel;

    constructor(element: Element, directive: string, controller: ReactiveController) {
        super(element, directive, controller);

        this.parsed = parseModelDirective(directive);
        this.valueModel = makeValueModel(this);

        this.emit = this.emit.bind(this);
        this.update = this.update.bind(this);

        const id = this.controller.identifier;
        this.element.addEventListener(`${id}:value`, this.emit);
        this.controller.element.addEventListener(`${id}:update`, this.update);
    }

    destroy(): void {
        const id = this.controller.identifier;
        this.element.removeEventListener(`${id}:value`, this.emit);
        this.controller.element.removeEventListener(`${id}:update`, this.update);
        this.valueModel.unbind();
    }

    emit() {
        const id = this.controller.identifier;
        const event = new UpdateEvent(`${id}:emit`, this.parsed.key, this.valueModel.get());
        this.element.dispatchEvent(event);
    }

    update(event: UpdateEvent) {
        const {key, value} = event.detail;

        if (key !== this.parsed.key) {
            return;
        }

        if (!this.valueModel) {
            return;
        }

        this.valueModel.set(value);
    }

    isLazy() {
        return this.parsed.modifiers.indexOf('lazy') !== -1;
    }
}