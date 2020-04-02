import Reactive from "../index";

export function update(node: HTMLElement | SVGElement, controller: Reactive) {
    const bindings = node.getAttribute('data-style').split(' ');

    bindings.forEach(b => {
        let [rule, prop] = b.split(':');
        
        node.style.setProperty(rule, controller.state[prop]);
    });
}