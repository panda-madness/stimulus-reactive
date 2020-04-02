import { Controller } from '@stimulus/core';
import { AttributeObserver } from '@stimulus/mutation-observers';
import { walkDOM } from "./util";
import * as Model from './directives/model';
import * as Text from './directives/text';
import * as Html from './directives/html';
import * as Bind from './directives/bind';
import * as Class from './directives/class';

export default class Reactive extends Controller {
    state: any = {};

    modelHandlers: Map<Element, Set<EventHandlerNonNull>> = new Map();

    modelObserver: AttributeObserver;

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
                Model.bind(element, this);
                this.refreshDOM();
            },
            elementAttributeValueChanged: (element) => {
                Model.unbind(element, this);
                Model.bind(element, this);
                this.refreshDOM();
            },
            elementUnmatchedAttribute: (element) => {
                Model.unbind(element, this);
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
                Model.bind($el, this);
            }
        });
    }

    unbind() {
        walkDOM(this.element, ($el) => {
            if ($el.hasAttribute('data-model')) {
                Model.unbind($el, this);
            }
        });
    }

    refreshDOM() {
        walkDOM(this.element, ($el) => {
            if ($el.hasAttribute('data-model')) {
                Model.update($el, this);
            }

            if ($el.hasAttribute('data-text')) {
                Text.update($el, this);
            }

            if ($el.hasAttribute('data-html')) {
                Html.update($el, this);
            }

            if ($el.hasAttribute('data-bind')) {
                Bind.update($el, this);
            }

            if ($el.hasAttribute('data-class')) {
                Class.update($el, this);
            }
        });
    }
};