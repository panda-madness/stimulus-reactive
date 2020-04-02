import Reactive from "../index";
import { listen, stopListening } from "../util";

const bindableTags = ['INPUT', 'SELECT', 'TEXTAREA'];
const nonSimpleInputs = ['BUTTON', 'SUBMIT', 'CHECKBOX', 'RADIO'];

function getInputValue(node: Element) {
    if (node instanceof HTMLInputElement && !nonSimpleInputs.includes(node.type)) {
        return node.value;
    }

    if (node instanceof HTMLSelectElement) {
        return node.value;
    }
}

function updateInputValue(node: Element, value: string) {
    if (node instanceof HTMLInputElement && !nonSimpleInputs.includes(node.type)) {
        node.value = value;
    }

    if (node instanceof HTMLSelectElement) {
        node.value = value;
    }
}

function getBindEvent(node: Element) {
    if (node.hasAttribute('data-lazy')) {
        return 'change';
    }

    if (node instanceof HTMLSelectElement) {
        return 'change';
    }

    return 'input';
}

function getModelProp(node: Element) {
    return node.getAttribute('data-model');
}

export function bind(node: Element, controller: Reactive) {
    if (!bindableTags.includes(node.tagName)) {
        throw new Error(`data-model directives arent't supported on ${node.tagName} elements`);
    }

    const model = getModelProp(node);

    const bindEvent = getBindEvent(node);

    const handler = () => {
        controller.state[model] = getInputValue(node);
    };

    listen(node, bindEvent, handler);

    let handlers = controller.modelHandlers.get(node);

    if (handlers) {
        handlers.add(handler);
        controller.modelHandlers.set(node, handlers);
    } else {
        const set = new Set<EventHandlerNonNull>();
        set.add(handler);
        controller.modelHandlers.set(node, set);
    }
}

export function unbind(node: Element, controller: Reactive) {
    const handlers = controller.modelHandlers.get(node);
    const event = getBindEvent(node);

    if (!handlers) {
        return;
    }

    handlers.forEach(h => {
        stopListening(node, event, h);
    });
}

export function update(node: Element, controller: Reactive) {
    const model = getModelProp(node);

    updateInputValue(node, controller.state[model]);
}