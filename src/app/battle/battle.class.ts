import { Combatant } from "./combatant.class";

export class Battle {
  element: any;
  combatants: {} = {};

  constructor() {
    this.combatants = {
      'player1': new Combatant({
        hp: 50,
        maxHp: 50,
        xp: 0,
        level: 1,
        status: null,
        // status: {
        //   type: 'clumsy',
        //   expiresIn: 3,
        // }
      }, this),
    }
  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.element);
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Battle');
    this.element.innerHTML = `
      <div class="Battle_hero">
        <img src="${'assets/character-01.webp'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${'assets/character-01.webp'}" alt="Enemy" />
      </div>
    `
  }
  
}