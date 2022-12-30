function wait(ms: number): Promise<any> {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, ms)
  });
}

(<any>window).BattleAnimations = {
  async spin(event: any, onComplete: any) {8
    const element = event.caster.pizzaElement;
    const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
    element.classList.add(animationClassName);

    // Remove class when animation is fully complete
    element.addEventListener("animationend", () => {
      element.classList.remove(animationClassName);
    }, { once:true });

    // Continue battle cycle right around when the pizzas collide
    await wait(100);
    onComplete();
  }
};

(<any>window).Actions = {
  damage1: {
    name: 'Whomp!',
    success: [
      { type: 'textMessage', text: '{CASTER} uses {ACTION}!' },
      { type: 'animation', animation: 'spin' },
      { type: 'stateChange', damage: 10 },
    ]
  }
}

export class SubmissionMenu {
  caster;
  enemy;
  onComplete;

  constructor({ caster, enemy, onComplete }: any) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  // This method simulates an enemy decision -- in a larger game, this probably would exist
  // on something like an enemy object. The 'target' can be anyone -- an actual enemy, a 
  // teammate, your character, etc.
  decide() {
    this.onComplete({
      action: (<any>window).Actions[this.caster.actions[0]],
      target: this.enemy,
    });
  }

  init(container: any) {
    this.decide();
  }
}