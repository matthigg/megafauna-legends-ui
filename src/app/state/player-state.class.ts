export class PlayerState {
  pizzas;
  lineup;
  items;

  constructor() {
    this.pizzas = {
      'p1': {
        pizzaId: 's001',
        hp: 30,
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
    }

    this.lineup = ['p1', 'p2'];
    this.items = [
      { actionId: 'item_recoverHp', instanceId: 'item1' },
      { actionId: 'item_recoverHp', instanceId: 'item2' },
      { actionId: 'item_recoverHp', instanceId: 'item3' },
    ]
  }
}
