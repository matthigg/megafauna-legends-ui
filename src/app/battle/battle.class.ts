import { BattleEvent } from "./battle-event.class";
import { Combatant } from "./combatant.class";
import { TurnCycle } from "./turn-cycle.class";

// TODO: this already exists in src/app/content/pizzas.ts, refactor into a helper function
// to set up global pizza variables
(<any>window).PizzaTypes = {
  normal: 'normal', 
  spicy: 'spicy', 
  veggie: 'veggie', 
  fungi: 'fungi', 
  chill: 'chill', 
};

(<any>window).Pizzas = {
  's001': {
    name: 'Slice Samurai',
    type: (<any>window).PizzaTypes.spicy,
    src: 'assets/pizzas/s001.png',
    icon: 'assets/pizza-icons/spicy.png',
    actions: [ 'damage1', ],
  },
  'v001': {
    name: 'Call Me Kale',
    type: (<any>window).PizzaTypes.veggie,
    src: 'assets/pizzas/v001.png',
    icon: 'assets/pizza-icons/veggie.png',
    actions: [ 'damage1', ],
  },
  'f001': {
    name: 'Portobello Express',
    type: (<any>window).PizzaTypes.fungi,
    src: 'assets/pizzas/f001.png',
    icon: 'assets/pizza-icons/fungi.png',
    actions: [ 'damage1', ],
  },
}

export class Battle {
  element: any;
  combatants: any;
  activeCombatants: any;
  turnCycle: any;

  constructor() {
    this.combatants = {
      'player1': new Combatant({
        ...(<any>window).Pizzas['s001'],
        team: 'player',
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        // status: null,
        status: {
          type: 'Saucy',
          expiresIn: 1,
        }
      }, this),
      'enemy1': new Combatant({
        ...(<any>window).Pizzas.v001,
        team: 'enemy',
        hp: 50,
        maxHp: 50,
        xp: 20,
        maxXp: 100,
        level: 1,
      }, this),
      'enemy2': new Combatant({
        ...(<any>window).Pizzas.f001,
        team: 'enemy',
        hp: 50,
        maxHp: 50,
        xp: 30,
        maxXp: 100,
        level: 1,
      }, this),
    }

    this.activeCombatants = {
      player: 'player1',
      enemy: 'enemy1',
    }
  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event: any) => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        });
      }
    });
    this.turnCycle.init();
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