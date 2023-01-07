import { KeyPressListener } from "./key-press-listener.class";
import { KeyboardMenu } from "./keyboard-menu.class";
import { wait } from "../shared/utils";
import { playerState } from "../shared/player-state";
import { Pizzas } from "../shared/utils";

export class PauseMenu {
  progress;
  onComplete;
  element: any;
  keyboardMenu: any;
  esc: any;

  constructor({ progress, onComplete }: any) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  async init(container: any) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions('root'));

    container.appendChild(this.element);

    // TODO - fix bug where hitting escape >= 3 times throws everything out of sync
    wait(200);
    this.esc = new KeyPressListener('Escape', () => {
      this.close();
    })
  }

  getOptions(pageKey: any) {

    // Case 1: Show the first page of pause menu options
    if (pageKey === 'root') {
      const lineupPizzas = playerState.lineup.map(id => {
        const { pizzaId } = (playerState.pizzas as any)[id];
        const base = (Pizzas as any)[pizzaId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions(id));
          },
        }
      });
      
      return [
        ... lineupPizzas,
        {
          label: 'Save',
          description: 'Save your progress',
          handler: () => {
            this.progress.save();
            this.close();
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
    
    // Case 2: Show the options for a single pizza (by id)
    const unequipped = Object.keys(playerState.pizzas).filter(id => {
      return playerState.lineup.indexOf(id) === -1;
    }).map(id => {
      const { pizzaId } = (playerState as any).pizzas[id];
      const base = (Pizzas as any)[pizzaId];
      return {
        label: `Swap for ${base.name}`,
        description: base.description,
        handler: () => {
          playerState.swapLineup(pageKey, id);
          this.keyboardMenu.setOptions(this.getOptions('root'));
        },
      }
    });
    
    
    return [
      ...unequipped,

      // Swap current pizza for another one
      {
        label: 'Move to front',
        description: 'Move this pizza to the front of the list',
        handler: () => {
          playerState.moveToFront(pageKey);

          this.keyboardMenu.setOptions(this.getOptions('root'));
        },
      },

      // Go back to main menu
      {
        label: 'Back',
        description: 'Go back to root menu',
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions('root'));
        },
      },
    ];
  }

  close(): void {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('PauseMenu');
    this.element.classList.add('overLayMenu');
    this.element.innerHTML = (`
      <h2>Pause Menu</h2>
    `);
  }


}