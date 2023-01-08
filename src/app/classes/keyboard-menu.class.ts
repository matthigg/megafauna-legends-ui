import { KeyPressListener } from "./key-press-listener.class";

export class KeyboardMenu {
  options: any[] = [];
  up: any;
  down: any;
  prevFocus: any;
  element: any;
  descriptionElement: any;
  descriptionElementText: any;
  descriptionContainer;

  constructor(config: any = {}) {
    this.options = [];  // Set by setOptions()
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
  }

  init(container: any): void {
    this.createElement();

    // This is an alternative way to call *.appendChild() on either this.descriptionContainer
    // or container
    container.appendChild(this.element);
    (this.descriptionContainer || container).appendChild(this.descriptionElement);

    // Note - there is a bug where prevButton references the 'Go back' button from previous
    // menu submission selections, ex. click Items -> Go back and the submission menu will
    // go back to the root menu (ie. Attack, Items, Swap) but prevButton will still reference
    // the 'Go back' button in the Items menu
    this.up = new KeyPressListener('ArrowUp', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const prevButton = Array.from(this.element.querySelectorAll('button[data-button]'))
        .reverse().find((el: any) => {
          return el.dataset.button < current && !el.disabled;
      });
      (prevButton as any)?.focus();
    });

    this.down = new KeyPressListener('ArrowDown', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const nextButton = Array.from(this.element.querySelectorAll('button[data-button]'))
        .find((el: any) => {
          return el.dataset.button > current && !el.disabled;
      });      
      (nextButton as any)?.focus();
    });
  }

  end(): void {

    // Remove submission menu element and description element
    this.element.remove();
    this.descriptionElement.remove();
    
    // Remove key bindings
    this.up.unbind();
    this.down.unbind();
  }

  setOptions(options: any) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {

      // TODO - fix edge case where a button can be both disabled and receive auto focus
      const disabledAttr = option.disabled ? 'disabled' : '';
      
      return `
        <div class="option">
          <button 
            ${disabledAttr} 
            data-button="${index}" 
            data-description="${option.description}"
          >
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `
    }).join('');

    this.element.querySelectorAll('button').forEach((button: any) => {

      // Note: button.dataset.button references the data-button attribute on the <button> 
      // element
      button.addEventListener('click', () => {
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      });

      // Note: button.focus() adds :focus-visible { outline: ... } via the user 
      // agent stylesheet to buttons, and is basically a button border
      button.addEventListener('mouseenter', () => {
        button.focus();
      });
      button.addEventListener('focus', () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    // Focus on the first <button> element with the data-button attribute that is not disabled
    setTimeout(() => {
      // const focusButton = this.element.querySelector("button[data-button]:not([disabled])").focus();
      const focusButtonDisasbled = this.element.querySelector("button:not([disabled])").focus();
    });
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('KeyboardMenu');

    // Create a description box that displays descriptions for each menu option
    this.descriptionElement = document.createElement('div');
    this.descriptionElement.classList.add('DescriptionBox');
    this.descriptionElement.innerHTML = [`<p></p>`];
    this.descriptionElementText = this.descriptionElement.querySelector('p');
  }




}