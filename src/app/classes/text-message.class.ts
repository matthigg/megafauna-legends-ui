import { KeyPressListener } from "./key-press-listener.class";
import { RevealingText } from "./revealing-text.class";

export class TextMessage {
  text: string;
  onComplete: any;
  element: any; // append to DOM to show text message
  actionListener: any;
  revealingText: any;

  constructor({text, onComplete}: any) {
    this.text = text;
    this.onComplete = onComplete;
  }

  init(container: any) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

  createElement() {

    // Create a container <div> to hold text messages
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    this.element.innerHTML = (`
      <p class="TextMessage_p"></p>
      <button mat-button class="TextMessage_button">Next</button>
    `);

    // Initialize the 'typewriter' effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage_p'),
      text: this.text,
    })

    // Create a button that can be used to close the text message box
    this.element.querySelector('button').addEventListener('click', () => {
      this.done();
    });

    // Configure the 'Enter' button to close the text message box
    this.actionListener = new KeyPressListener('Enter', () => {
      this.actionListener.unbind();
      this.done();
    })
  }

  // Close the text message
  done(): void {
    this.element.remove()
    this.onComplete();
  }
}