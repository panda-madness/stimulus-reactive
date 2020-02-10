import {Controller} from '@stimulus/core';
import {TokenListObserver, Token} from '@stimulus/mutation-observers';
import {Multimap} from '@stimulus/multimap';
import {get, set} from 'lodash-es';
import {Reactive} from "./reactive";
import {makeReactive, UpdateEvent} from "./util";

export class ReactiveController extends Controller {
    protected state: object = {};

    protected observer: TokenListObserver;

    protected reactables: Multimap<Element, Reactive>;

    getState(key: string = null) {
        if (key === null) {
            return this.state;
        }

        return get(this.state, key);
    }

    setState(key: string, value: any) {
        set(this.state, key, value);
        this.dispatch(key, value);
        console.log(this.state);
    }

    dispatch(key: string, value: any) {
        const event = new UpdateEvent('reactive:update', key, value);
        this.element.dispatchEvent(event);
    }

    handleEmit(e: UpdateEvent) {
        const {key, value} = e.detail;
        this.setState(key, value);
    }

    initialize(): void {
        this.handleEmit = this.handleEmit.bind(this);
    }

    connect(): void {
        this.reactables = new Multimap();
        this.element.addEventListener(`${this.identifier}:emit`, this.handleEmit);

        this.observer = new TokenListObserver(
            this.element,
            `data-${this.identifier}`,
            {
                tokenMatched: (token: Token): void => {
                    const reactive = makeReactive(token.element, token.content, this);

                    if (reactive) {
                        this.reactables.add(token.element, reactive);
                    }
                },
                tokenUnmatched: (token: Token): void => {
                    const reactable = this.reactables
                        .getValuesForKey(token.element)
                        .find(r => r.directive === token.content);

                    if (reactable) {
                        reactable.destroy();
                        this.reactables.delete(token.element, reactable);
                    }
                }
            });

        this.observer.start();
    }

    disconnect(): void {
        this.observer.stop();
        this.element.removeEventListener(`${this.identifier}:emit`, this.handleEmit);
    }
}