import { emitEvent } from "../shared/utils";

export class PlayerState {
  pizzas;
  lineup;
  items;
  storyFlags = {};

  constructor() {
    this.pizzas = {
      'p1': {
        pizzaId: 's001',
        hp: 10,
        maxHp: 50,
        xp: 95,
        maxXp: 100,
        level: 1,
        status: { type: 'Saucy' },
      },
      'p2': {
        pizzaId: 'v001',
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 2,
        status: null,
      },
      'p3': {
        pizzaId: 'f001',
        hp: 40,
        maxHp: 50,
        xp: 25,
        maxXp: 100,
        level: 2,
        status: null,
      },
    }

    this.lineup = ['p1'];
    this.items = [
      { actionId: 'item_recoverHp', instanceId: 'item1' },
      { actionId: 'item_recoverHp', instanceId: 'item2' },
      { actionId: 'item_recoverHp', instanceId: 'item3' },
    ];
  }

  addPizza(pizzaId: any) {
    const newId = `p${Date.now()}` +Math.floor(Math.random() * 99999);
    (this.pizzas as any)[newId] = {
      pizzaId: 'v001',
      hp: 50,
      maxHp: 50,
      xp: 75,
      maxXp: 100,
      level: 1,
      status: null,
    }

    
    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }
    emitEvent("LineupChanged", {});

    console.log('--- this:', this);
  }

  moveToFront(futureFrontId: any): void {
    this.lineup = this.lineup.filter(id => id !== futureFrontId)
    this.lineup.unshift(futureFrontId);
    emitEvent('LineupChanged', {});
  }

  swapLineup(oldId: any, incomingId: any): void {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    emitEvent('LineupChanged', {});
  }
}
