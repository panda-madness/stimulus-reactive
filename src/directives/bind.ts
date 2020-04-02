import Reactive from "../index";

export function update(node: Element, controller: Reactive) {
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