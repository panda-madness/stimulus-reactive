import Reactive from "../index";
import { listen, stopListening } from "../util";

const BINDABLE_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];
const ARRAY_INPUTS = ['CHECKBOX', 'RADIO'];

function getInputValue(node: Element) {
    if (node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement) {
        return node.value;
    }

    if (!(node instanceof HTMLInputElement)) {
        throw new Error('Invalid input type');
    }

    const nodeType = node.type.toUpperCase();

    if (!ARRAY_INPUTS.includes(nodeType)) {
        return node.value;
    }

    if (['CHECKBOX', 'RADIO'].includes(nodeType)) {
        const form = node.form;

        const $checkboxes = form.elements.namedItem(node.name);

        if ($checkboxes instanceof RadioNodeList) {
            if (nodeType === 'CHECKBOX') {
                return Array.from($checkboxes)
                    .filter(($c: HTMLInputElement) => $c.checked)
                    .map(($c: HTMLInputElement) => $c.value);
            }

            return $checkboxes.value;
        }

        return node.checked;
    }

    return null;
}

function updateInputValue(node: Element, value: any) {
    if (node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement) {
        node.value = value;
    }

    if (!(node instanceof HTMLInputElement)) {
        throw new Error('Invalid input type');
    }

    const nodeType = node.type.toUpperCase();

    if (!ARRAY_INPUTS.includes(nodeType)) {
        node.value = value;
    }

    if (['CHECKBOX', 'RADIO'].includes(nodeType)) {
        const form = node.form;

        const $checkboxes = form.elements.namedItem(node.name);

        if ($checkboxes instanceof RadioNodeList) {
            if (value instanceof Array) {
                $checkboxes.forEach(($c: HTMLInputElement) => {
                    $c.checked = value.includes($c.value);
                });
                return;
            }

            $checkboxes.value = value;
            return;
        }

        node.checked = Boolean(value);
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
    if (!BINDABLE_TAGS.includes(node.tagName)) {
        throw new Error(`data-model directives arent't supported on ${node.tagName} elements`);
    }

    const model = getModelProp(node);

    const bindEvent = getBindEvent(node);

    const handler = () => {
        controller.state[model] = getInputValue(node);
    };

    handler();
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