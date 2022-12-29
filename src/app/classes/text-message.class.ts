import { KeyPressListener } from "./key-press-listener.class";

export class TextMessage {
  text: string;
  onComplete: any;
  element: any; // append to DOM to show text message
  actionListener: any;

  constructor({text, onComplete}: any) {
    this.text = text;
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    this.element.innerHTML = (`
      <p class="TextMessage_p">${this.text}</p>
      <button mat-button class="TextMessage_button">Next</button>
    `);

    this.element.querySelector('button').addEventListener('click', () => {
      this.done();
    });

    this.actionListener = new KeyPressListener('Enter', () => {
      this.actionListener.unbind();
      this.done();
    })
  }

  init(container: any) {
    this.createElement();
    container.appendChild(this.element);
  }

  // Close the text message
  done(): void {
    this.element.remove()
    this.onComplete();
  }
}