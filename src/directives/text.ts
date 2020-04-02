import { Reactive } from "../index";

export function update(node: Element, controller: Reactive) {
    const prop = node.getAttribute('data-text');

    if (node instanceof HTMLElement) {
        node.innerText = controller.state[prop];
    }
}