import { Reactive } from "../index";

export function update(node: Element, controller: Reactive) {
    const prop = node.getAttribute('data-html');

    if (node instanceof HTMLElement) {
        node.innerHTML = controller.state[prop];
    }
}