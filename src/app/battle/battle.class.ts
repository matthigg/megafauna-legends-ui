import { BattleEvent } from "./battle-event.class";
import { Combatant } from "./combatant.class";
import { TurnCycle } from "./turn-cycle.class";
import { Pizzas } from "../shared/utils";
import { Team } from "./team.class";
// import { playerState } from "../shared/utils";

export class Battle {
  element: any;
  combatants: any;
  activeCombatants: any;
  turnCycle: any;
  items: any[] = [];
  playerTeam: any;
  enemyTeam: any;
  enemy;
  onComplete;
  usedInstanceIds: any;

  constructor({ enemy, onComplete }: any) {

    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {
      // 'player1': new Combatant({
      //   ...Pizzas.s001,
      //   team: 'player',
      //   hp: 50,
      //   maxHp: 50,
      //   xp: 95,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      //   // status: {
      //   //   type: 'Saucy',
      //   //   expiresIn: 10,
      //   // },
      //   isPlayerControlled: true,
      // }, this),
      // 'player2': new Combatant({
      //   ...Pizzas.s002,
      //   team: 'player',
      //   hp: 50,
      //   maxHp: 50,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      //   // status: {
      //   //   type: 'Saucy',
      //   //   expiresIn: 10,
      //   // },
      //   isPlayerControlled: true,
      // }, this),
      // 'enemy1': new Combatant({
      //   ...Pizzas.v001,
      //   team: 'enemy',
      //   hp: 1,
      //   maxHp: 50,
      //   xp: 20,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      //   // status: {
      //   //   type: 'Clumsy',
      //   //   expiresIn: 10,
      //   // },
      // }, this),
      // 'enemy2': new Combatant({
      //   ...Pizzas.f001,
      //   team: 'enemy',
      //   hp: 50,
      //   maxHp: 50,
      //   xp: 30,
      //   maxXp: 100,
      //   level: 1,
      // }, this),
    };



    this.activeCombatants = {
      // player: 'player1',
      // enemy: 'enemy1',
      player: null,
      enemy: null,
    };

    // Dynamically add the player team    
    (<any>window).PlayerState.lineup.forEach((id: any) => {   
      this.addCombatant(id, 'player', (<any>window).PlayerState.pizzas[id])
    })

    // Dynamically add the enemy team    
    Object.keys(this.enemy.pizzas).forEach(key => {
      this.addCombatant('e_' + key, 'enemy', this.enemy.pizzas[key])
    })
    // (<any>window).PlayerState.lineup.forEach((id: any) => {   
    //   this.addCombatant(id, 'player', (<any>window).PlayerState.pizzas[id])
    // })

    this.items = [
      // { actionId: 'item_recoverStatus', instanceId: 'p1', team: 'player' },
      // { actionId: 'item_recoverStatus', instanceId: 'p2', team: 'player' },
      // { actionId: 'item_recoverStatus', instanceId: 'p3', team: 'enemy' },
      // { actionId: 'item_recoverHp', instanceId: 'p4', team: 'player' },
    ];

    // Populate initial items[] list from player state
    (<any>window).PlayerState.items.forEach((item: any) => {
      this.items.push({
        ...item,
        team: 'player',
      })
    })

    // This 'bucket' keeps track of which items were used and need to be discarded
    this.usedInstanceIds = {};
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
      }, 
      onWinner: (winner: any) => {

        // Update player state to the window.PlayerState object, so that player state is saved
        // between battles
        if (winner === 'player') {
          const playerState = (<any>window).PlayerState;
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.level = combatant.level;
            }
          });

          // Get rid of player used items
          playerState.items = playerState.items.filter((item: any) => {
            return !this.usedInstanceIds[item.instanceId];
          });
        }
        
        this.element.remove();
        this.onComplete();
      },
    });
    this.turnCycle.init();
  }

  addCombatant(id: any, team: any, config: any) {
    // 'enemy2': new Combatant({
    //   ...Pizzas.f001,
    //   team: 'enemy',
    //   hp: 50,
    //   maxHp: 50,
    //   xp: 30,
    //   maxXp: 100,
    //   level: 1,
    // }, this),
    this.combatants[id] = new Combatant({
      ...Pizzas[config.pizzaId as keyof typeof Pizzas],
      ...config,
      team,
      isPlayerControlled: team === 'player'
    }, this);

    // Populate first active pizza
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Battle');
    this.element.innerHTML = `
      <div class="Battle_hero">
        <img src="${'assets/character-01.webp'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
      </div>
    `
  }
  
}
