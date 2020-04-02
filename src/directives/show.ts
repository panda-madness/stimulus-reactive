import { Reactive } from "../index";

export function update(node: Element, controller: Reactive) {
    const prop = node.getAttribute('data-show');
    const value = controller.state[prop];

    console.log(Boolean(value), value);
    if (node instanceof HTMLElement || node instanceof SVGElement) {
        if (Boolean(value)) {
            node.style.removeProperty('display');
        } else {
            node.style.display = 'none';
        }
    }
}