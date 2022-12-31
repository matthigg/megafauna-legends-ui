import { KeyPressListener } from "./key-press-listener.class";

export class KeyboardMenu {
  options: any[] = [];
  up: any;
  down: any;
  prevFocus: any;
  element: any;
  descriptionElement: any;
  descriptionElementText: any;

  constructor() {
    this.options = [];  // Set by setOptions()
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.descriptionElement);
    container.appendChild(this.element);

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
      button.addEventListener('click', () => {

        // Note: button.dataset.button references the data-button attribute on the <button> 
        // element
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      });
      button.addEventListener('mouseenter', () => {
        button.focus();
      });
      button.addEventListener('focus', () => {
        this.prevFocus = button;

        // Note: button.dataset.description references the data-description attribute on the 
        // <button> element
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    // Focus on the first <button> element with the data-button attribute that is not disabled
    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 10);
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('KeyboardMenu');

    // Create a description box that displays descriptions for each menu option
    this.descriptionElement = document.createElement('div');
    this.descriptionElement.classList.add('DescriptionBox');
    this.descriptionElement.innerHTML = [`<p>Descriptions go here</p>`];
    this.descriptionElementText = this.descriptionElement.querySelector('p');
  }




}