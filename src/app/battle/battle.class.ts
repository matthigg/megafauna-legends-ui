import { BattleEvent } from "./battle-event.class";
import { Combatant } from "./combatant.class";
import { TurnCycle } from "./turn-cycle.class";
import { Pizzas } from "../shared/utils";
import { Team } from "./team.class";

export class Battle {
  element: any;
  combatants: any;
  activeCombatants: any;
  turnCycle: any;
  items: any[] = [];
  playerTeam: any;
  enemyTeam: any;

  constructor() {
    this.combatants = {
      'player1': new Combatant({
        ...Pizzas.s001,
        team: 'player',
        hp: 50,
        maxHp: 50,
        xp: 95,
        maxXp: 100,
        level: 1,
        status: null,
        // status: {
        //   type: 'Saucy',
        //   expiresIn: 10,
        // },
        isPlayerControlled: true,
      }, this),
      'player2': new Combatant({
        ...Pizzas.s002,
        team: 'player',
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null,
        // status: {
        //   type: 'Saucy',
        //   expiresIn: 10,
        // },
        isPlayerControlled: true,
      }, this),
      'enemy1': new Combatant({
        ...Pizzas.v001,
        team: 'enemy',
        hp: 1,
        maxHp: 50,
        xp: 20,
        maxXp: 100,
        level: 1,
        status: null,
        // status: {
        //   type: 'Clumsy',
        //   expiresIn: 10,
        // },
      }, this),
      'enemy2': new Combatant({
        ...Pizzas.f001,
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

    this.items = [
      { actionId: 'item_recoverStatus', instanceId: 'p1', team: 'player' },
      { actionId: 'item_recoverStatus', instanceId: 'p2', team: 'player' },
      { actionId: 'item_recoverStatus', instanceId: 'p3', team: 'enemy' },
      { actionId: 'item_recoverHp', instanceId: 'p4', team: 'player' },
    ]
  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team('player', 'Hero');
    this.enemyTeam = new Team('enemy', 'Bully');

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      // Add combatant to correct team
      if (combatant.team === 'player') {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === 'enemy') {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

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