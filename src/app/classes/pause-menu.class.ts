import { KeyPressListener } from "./key-press-listener.class";
import { KeyboardMenu } from "./keyboard-menu.class";
import { wait } from "../shared/utils";

export class PauseMenu {
  onComplete;
  element: any;
  keyboardMenu: any;
  esc: any;

  constructor({ onComplete }: any) {
    this.onComplete = onComplete;
  }

  async init(container: any): void {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({

      //

    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions('root'));

    container.appendChild(this.element);

    wait(200)
    this.esc = new KeyPressListener('Escape', () => {
      this.close();
    })
  }

  getOptions(pageKey: any) {
    if (pageKey === 'root') {

      // TODO - dynamically return all pizzas here
      return [
        {
          label: 'Save',
          description: 'Save your progress',
          handler: () => {

            // TODO - put something here
          },
        },
        {
          label: 'Close',
          description: 'Close the pause menu',
          handler: () => {
            this.close();
          },
        },
      ];
    }
    
    return [];
  }

  close(): void {

  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('PauseMenu');
    this.element.innerHTML = (`
      <h2>Pause Menu</h2>
    `);
  }


}