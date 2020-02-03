import { Controller as C } from '@stimulus/core';
import { AttributeObserver } from '@stimulus/mutation-observers';
import { get, set } from 'lodash-es';
import { ReactiveElement } from './reactive-element';

export class Reactive extends C {
  private reactiveObserver: AttributeObserver;
  private stateObsercer: AttributeObserver;
  private children: Map<Element, ReactiveElement> = new Map();

  connect(): void {
    super.connect();

    this.elementMatchedAttribute = this.elementMatchedAttribute.bind(this);
    this.elementUnmatchedAttribute = this.elementUnmatchedAttribute.bind(this);
    this.elementAttributeValueChanged = this.elementAttributeValueChanged.bind(this);

    this.receiveValue = this.receiveValue.bind(this);
    this.handleExternalStateChange = this.handleExternalStateChange.bind(this);

    this.reactiveObserver = new AttributeObserver(this.element, `data-${this.identifier}`, {
      elementMatchedAttribute: this.elementMatchedAttribute,
      elementUnmatchedAttribute: this.elementUnmatchedAttribute,
      elementAttributeValueChanged: this.elementAttributeValueChanged,
    });

    this.stateObsercer = new AttributeObserver(this.element, `data-${this.identifier}-state`, {
      elementAttributeValueChanged: this.handleExternalStateChange,
    });

    this.reactiveObserver.start();
    this.stateObsercer.start();

    this.element.addEventListener(`${this.identifier}:value`, this.receiveValue);

    if (this.data.has('state')) {
      this.emitState();
    } else {
      this.bootstrapState();
    }
  }

  disconnect(): void {
    this.reactiveObserver.stop();
    this.stateObsercer.stop();

    this.element.removeEventListener(`${this.identifier}:value`, this.receiveValue);
    super.disconnect();
  }

  private elementMatchedAttribute(element: Element, attributeName: string): void {
    this.children.set(element, new ReactiveElement(element, this));
  }

  private elementUnmatchedAttribute(element: Element, attributeName: string): void {
    this.children.get(element).destroy();
    this.children.delete(element);
  }

  private elementAttributeValueChanged(element: Element, attributeName: string): void {
    this.children.get(element).destroy();
    this.children.delete(element);
    
    this.children.set(element, new ReactiveElement(element, this));
  }

  getState(key?: string) {
    const state = JSON.parse(this.data.get('state'));

    if (!key) {
      return state;
    }

    return get(state, key);
  }

  setState(key: string, value: any) {
    let state = this.getState() ?? {};
    set(state, key, value);
    this.data.set('state', JSON.stringify(state));
  }

  receiveValue(e: CustomEvent) {
    const { prop, value } = e.detail;
    this.setState(prop, value);
  }

  handleExternalStateChange(element: Element, attributeName: string) {
    const raw = element.getAttribute(attributeName);
    JSON.parse(raw);
    this.emitState();
  }

  emitState() {
    this.element.dispatchEvent(new CustomEvent(`${this.identifier}:state`, {
      detail: this.getState()
    }));
  }

  bootstrapState() {
    this.element.dispatchEvent(new CustomEvent(`${this.identifier}:bootstrap`));
  }
}