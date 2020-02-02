import { Controller as C } from '@stimulus/core';
import { AttributeObserver } from '@stimulus/mutation-observers';
import { get, set } from 'lodash-es';
import { ReactiveElement } from './reactive-element';

export class Reactive extends C {
  private observer: AttributeObserver;

  private stateObsercer: AttributeObserver;

  private children: Map<Element, ReactiveElement> = new Map();

  connect(): void {
    super.connect();

    this.elementMatchedAttribute = this.elementMatchedAttribute.bind(this);
    this.elementUnmatchedAttribute = this.elementUnmatchedAttribute.bind(this);
    this.elementAttributeValueChanged = this.elementAttributeValueChanged.bind(this);

    this.receiveValue = this.receiveValue.bind(this);
    this.handleExternalStateChange = this.handleExternalStateChange.bind(this);

    this.observer = new AttributeObserver(this.element, `data-${this.identifier}`, {
      elementMatchedAttribute: this.elementMatchedAttribute,
      elementUnmatchedAttribute: this.elementUnmatchedAttribute,
      elementAttributeValueChanged: this.elementAttributeValueChanged,
    });

    this.stateObsercer = new AttributeObserver(this.element, `data-${this.identifier}-state`, {
      elementAttributeValueChanged: this.handleExternalStateChange,
    });

    this.observer.start();
    this.stateObsercer.start();

    this.element.addEventListener(`${this.identifier}:value`, this.receiveValue);

    this.emitState();
  }

  disconnect(): void {
    this.observer.stop();
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
    let state;

    try {
      state = JSON.parse(this.data.get('state'));
    } catch {
      state = {};
      this.data.set('state', JSON.stringify(state));
    }

    if (!key) {
      return state;
    }

    return get(state, key);
  }

  setState(key: string, value: any) {
    let state = this.getState();
    set(state, key, value);
    this.data.set('state', JSON.stringify(state));

    this.emitState();
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
}