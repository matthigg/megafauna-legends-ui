import { KeyboardMenu } from "./keyboard-menu.class";
import { Pizzas } from "../shared/utils";
import { playerState } from "../shared/player-state";

export class CraftingMenu {
  pizzas;
  onComplete;
  element: any;
  keyboardMenu: any;

  constructor({pizzas, onComplete }: any) {
    this.pizzas = pizzas;
    this.onComplete = onComplete;
  }

  init(container: any) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions());

    container.appendChild(this.element);
  }

  createElement(): void {
    this.element = document.createElement('div');
    this.element.classList.add('CraftingMenu');
    this.element.classList.add('overLayMenu');
    this.element.innerHTML = (`

      <h2>Create a Pizza</h2>
    
    `)
  }
  

  close(): void {
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }
  
  getOptions() {
    return this.pizzas.map((id: any) => {
      const base = (Pizzas as any)[id];
      return {
        label: base.name,
        description: base.description,
        handler: () => {
          // Create a way to add a pizza to playerState

          playerState.addPizza(id);

          this.close();
        }
      }
    })
  }



}
