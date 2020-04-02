type EventHandler = (event: Event) => void;

export function $(selector: string, scope: Element | Document = document) {
    return scope.querySelector(selector);
}

export function $$(selector: string, scope: Element | Document = document) {
    return Array.from(scope.querySelectorAll(selector));
}

export function nextTick(callback: Function) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => callback());
    });
}

export function dispatch(event: string, node: EventTarget = document, detail: object = null) {
    node.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
}

export function delegate(type: string, selector: string, callback: (event: Event, target: Element) => void) {
    document.addEventListener(type, function handle(event) {
        const $eventTarget = event.target as Element;

        const target = $eventTarget.closest(selector);

        if (target) {
            callback(event, target);
        }
    });
}

export function listen(node: EventTarget, type: string, callback: (event: Event) => void) {
    node.addEventListener(type, callback);
}

export function listenOnce(node: EventTarget, type: string, callback: EventHandler) {
    node.addEventListener(type, function handle(e) {
        callback(e);
        node.removeEventListener(type, handle);
    });
}

export function stopListening(node: EventTarget, type: string, callback: EventHandler) {
    node.removeEventListener(type, callback);
}


export function walkDOM(node: Element, callback: (node: Element) => void) {
    callback(node);

    node = node.firstElementChild;

    while (node) {
        walkDOM(node, callback);

        node = node.nextElementSibling;
    }
}