import { Controller } from '@stimulus/core';
import { AttributeObserver } from '@stimulus/mutation-observers';

function listen(node, type, callback) {
    node.addEventListener(type, callback);
}
function stopListening(node, type, callback) {
    node.removeEventListener(type, callback);
}
function walkDOM(node, callback) {
    callback(node);
    node = node.firstElementChild;
    while (node) {
        walkDOM(node, callback);
        node = node.nextElementSibling;
    }
}

const BINDABLE_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];
const ARRAY_INPUTS = ['CHECKBOX', 'RADIO'];
function getInputValue(node) {
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
                    .filter(($c) => $c.checked)
                    .map(($c) => $c.value);
            }
            return $checkboxes.value;
        }
        return node.checked;
    }
    return null;
}
function updateInputValue(node, value) {
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
                $checkboxes.forEach(($c) => {
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
function getBindEvent(node) {
    if (node.hasAttribute('data-lazy')) {
        return 'change';
    }
    if (node instanceof HTMLSelectElement) {
        return 'change';
    }
    return 'input';
}
function getModelProp(node) {
    return node.getAttribute('data-model');
}
function bind(node, controller) {
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
    }
    else {
        const set = new Set();
        set.add(handler);
        controller.modelHandlers.set(node, set);
    }
}
function unbind(node, controller) {
    const handlers = controller.modelHandlers.get(node);
    const event = getBindEvent(node);
    if (!handlers) {
        return;
    }
    handlers.forEach(h => {
        stopListening(node, event, h);
    });
}
function update(node, controller) {
    const model = getModelProp(node);
    updateInputValue(node, controller.state[model]);
}

function update$1(node, controller) {
    const prop = node.getAttribute('data-text');
    if (node instanceof HTMLElement) {
        node.innerText = controller.state[prop];
    }
}

function update$2(node, controller) {
    const prop = node.getAttribute('data-html');
    if (node instanceof HTMLElement) {
        node.innerHTML = controller.state[prop];
    }
}

function update$3(node, controller) {
    const bindings = node.getAttribute('data-bind').split(' ');
    bindings.forEach(b => {
        const [attr, prop] = b.split(':');
        if (!prop) {
            throw new Error('Each bound attribute needs a corresponding prop');
        }
        const value = controller.state[prop];
        if (value === false) {
            node.removeAttribute(attr);
            return;
        }
        if (value === true) {
            node.setAttribute(attr, '');
            return;
        }
        node.setAttribute(attr, value);
    });
}

function update$4(node, controller) {
    const bindings = node.getAttribute('data-class').split(' ');
    bindings.forEach(b => {
        let [classesString, prop] = b.split(':');
        const classes = classesString.split(',');
        let isPositive = true;
        if (prop.startsWith('!')) {
            prop = prop.slice(1);
            isPositive = false;
        }
        const value = Boolean(controller.state[prop]) && isPositive;
        if (value) {
            node.classList.add(...classes);
            return;
        }
        node.classList.remove(...classes);
    });
}

function update$5(node, controller) {
    const bindings = node.getAttribute('data-style').split(' ');
    bindings.forEach(b => {
        let [rule, prop] = b.split(':');
        node.style.setProperty(rule, controller.state[prop]);
    });
}

function update$6(node, controller) {
    const prop = node.getAttribute('data-show');
    const value = controller.state[prop];
    console.log(Boolean(value), value);
    if (node instanceof HTMLElement || node instanceof SVGElement) {
        if (Boolean(value)) {
            node.style.removeProperty('display');
        }
        else {
            node.style.display = 'none';
        }
    }
}

class Reactive extends Controller {
    constructor() {
        super(...arguments);
        this.state = {};
        this.modelHandlers = new Map();
    }
    connect() {
        this.state = new Proxy(this.state, {
            set: (target, p, value) => {
                target[p] = value;
                this.refreshDOM();
                return true;
            },
            get: (target, p) => {
                if (target[p]) {
                    return target[p];
                }
                return '';
            }
        });
        this.modelObserver = new AttributeObserver(this.element, 'data-model', {
            elementMatchedAttribute: (element) => {
                bind(element, this);
                this.refreshDOM();
            },
            elementAttributeValueChanged: (element) => {
                unbind(element, this);
                bind(element, this);
                this.refreshDOM();
            },
            elementUnmatchedAttribute: (element) => {
                unbind(element, this);
            },
        });
        this.modelObserver.start();
        this.refreshDOM();
    }
    disconnect() {
        this.modelObserver.stop();
        this.unbind();
    }
    bind() {
        walkDOM(this.element, ($el) => {
            if ($el.hasAttribute('data-model')) {
                bind($el, this);
            }
        });
    }
    unbind() {
        walkDOM(this.element, ($el) => {
            if ($el.hasAttribute('data-model')) {
                unbind($el, this);
            }
        });
    }
    refreshDOM() {
        walkDOM(this.element, ($el) => {
            if ($el.hasAttribute('data-model')) {
                update($el, this);
            }
            if ($el.hasAttribute('data-text')) {
                update$1($el, this);
            }
            if ($el.hasAttribute('data-html')) {
                update$2($el, this);
            }
            if ($el.hasAttribute('data-bind')) {
                update$3($el, this);
            }
            if ($el.hasAttribute('data-class')) {
                update$4($el, this);
            }
            if ($el.hasAttribute('data-style')) {
                update$5($el, this);
            }
            if ($el.hasAttribute('data-show')) {
                update$6($el, this);
            }
        });
    }
}

export { Reactive };
