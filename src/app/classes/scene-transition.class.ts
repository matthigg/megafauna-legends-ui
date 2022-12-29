import { InteractivityChecker } from "@angular/cdk/a11y";

export class SceneTransition {
  element: any;

  constructor() {
    this.element = null;
  }

  init(container: any, callback: any): void {
    this.createElement();
    container.appendChild(this.element);

    this.element.addEventListener('animationend', () => {
        callback();
      }, 
      { once: true }
    );
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('SceneTransition')
  }

  fadeOut(): void {
    this.element.classList.add('fade-out');
    this.element.addEventListener('animationend', () => {
      this.element.remove();
    }, { once: true });
  }

}