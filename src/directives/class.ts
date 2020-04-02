import Reactive from "../index";

export function update(node: Element, controller: Reactive) {
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