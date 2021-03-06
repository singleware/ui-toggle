/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';
import { States } from './states';

/**
 * Toggle template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Toggle states.
   */
  @Class.Private()
  private states = {
    name: '',
    readOnly: false,
    checked: false
  } as States;

  /**
   * Mark element.
   */
  @Class.Private()
  private markSlot = <slot name="mark" class="mark" /> as HTMLSlotElement;

  /**
   * Toggle element.
   */
  @Class.Private()
  private toggle = (
    <button type="button" class="toggle">
      {this.markSlot}
    </button>
  ) as HTMLButtonElement;

  /**
   * Toggle styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host > .toggle {
  user-select: none;
  display: block;
  outline: 0;
  padding: 0;
  border: 0;
  margin: 0;
  cursor: inherit;
  background-color: transparent;
  width: inherit;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Toggle skeleton.
   */
  @Class.Private()
  private skeleton = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Updates the specified property state.
   * @param property Property name.
   * @param state Property state.
   */
  @Class.Private()
  private updatePropertyState(property: string, state: boolean): void {
    if (state) {
      this.skeleton.dataset[property] = 'on';
    } else {
      delete this.skeleton.dataset[property];
    }
  }

  /**
   * Click event handler.
   * @param event Event information.
   */
  @Class.Private()
  private clickHandler(event: Event): void {
    if (this.states.readOnly) {
      event.preventDefault();
    } else if (this.group) {
      const last = Template.groups[this.group];
      if (last !== this.skeleton) {
        if (last) {
          last.checked = false;
          Template.notifyChanges(last);
        }
        this.updatePropertyState('checked', (this.states.checked = true));
        Template.groups[this.group] = this.skeleton;
        Template.notifyChanges(this.skeleton);
      }
    } else {
      this.updatePropertyState('checked', (this.states.checked = !this.states.checked));
      Template.notifyChanges(this.skeleton);
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.toggle.addEventListener('click', this.clickHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    this.bindComponentProperties(this.skeleton, [
      'name',
      'group',
      'value',
      'checked',
      'defaultValue',
      'defaultChecked',
      'readOnly',
      'disabled',
      'statusOnly',
      'reset'
    ]);
  }

  /**
   * Assign all element properties.
   */
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['name', 'group', 'value', 'checked', 'readOnly', 'disabled', 'statusOnly']);
  }

  /**
   * Default constructor.
   * @param properties Toggle properties.
   * @param children Toggle children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
    DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.toggle);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Get toggle name.
   */
  @Class.Public()
  public get name(): string {
    return this.states.name;
  }

  /**
   * Set toggle name.
   */
  public set name(name: string) {
    this.states.name = name;
  }

  /**
   * Get toggle group.
   */
  @Class.Public()
  public get group(): string {
    return this.toggle.name;
  }

  /**
   * Set toggle group.
   */
  public set group(name: string) {
    this.toggle.name = name;
  }

  /**
   * Get toggle value.
   */
  @Class.Public()
  public get value(): any {
    if (this.states.statusOnly) {
      return this.checked;
    }
    return this.checked ? this.toggle.value : void 0;
  }

  /**
   * Set toggle value.
   */
  public set value(value: any) {
    if (this.states.statusOnly) {
      this.checked = Boolean(value);
    } else {
      this.toggle.value = value;
    }
  }

  /**
   * Get toggle state.
   */
  @Class.Public()
  public get checked(): boolean {
    return this.states.checked;
  }

  /**
   * Set toggle state.
   */
  public set checked(state: boolean) {
    if (this.group) {
      const last = Template.groups[this.group];
      if (state) {
        if (last && last !== this.skeleton) {
          last.checked = false;
        }
        Template.groups[this.group] = this.skeleton;
      } else if (last === this.skeleton) {
        Template.groups[this.group] = void 0;
      }
    }
    this.updatePropertyState('checked', (this.states.checked = state));
  }

  /**
   * Get default toggle value.
   */
  @Class.Public()
  public get defaultValue(): any {
    return this.properties.value || 'on';
  }

  /**
   * Get default checked state.
   */
  @Class.Public()
  public get defaultChecked(): boolean {
    return this.properties.checked || false;
  }

  /**
   * Get read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.states.readOnly;
  }

  /**
   * Set read-only state.
   */
  public set readOnly(state: boolean) {
    this.states.readOnly = state;
    this.toggle.disabled = state || this.toggle.disabled;
    this.updatePropertyState('readonly', state);
  }

  /**
   * Get disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.toggle.disabled;
  }

  /**
   * Set disabled state.
   */
  public set disabled(state: boolean) {
    this.toggle.disabled = state || this.states.readOnly;
    this.updatePropertyState('disabled', state);
  }

  /**
   * Get status-only state.
   */
  @Class.Public()
  public get statusOnly(): boolean {
    return this.states.statusOnly;
  }

  /**
   * Set status-only state.
   */
  public set statusOnly(state: boolean) {
    this.states.statusOnly = state;
  }

  /**
   * Toggle element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Reset the toggle to its initial value and state.
   */
  @Class.Public()
  public reset(): void {
    this.value = this.defaultValue;
    this.checked = this.defaultChecked;
  }

  /**
   * Toggle groups.
   */
  @Class.Private()
  private static groups = {} as any;

  /**
   * Notify element changes.
   */
  @Class.Private()
  private static notifyChanges(element: Element): void {
    if (document.body.contains(element)) {
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
    }
  }
}
