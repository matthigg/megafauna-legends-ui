export class TextMessage {
  text: string;
  onComplete: any;
  element: any; // append to DOM to show text message

  constructor(text: string, onComplete: any) {
    this.text = text;
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    this.element.innerHTML = (`
      <p class="TextMessage_p">${this.text}</p>
      <button class="TextMessage_button">Next</button>
    `);
  }

  init(container: any) {
    this.createElement();
    container.appendChild(this.element);
  }
}