// ========== SHARED VARIABLES ==============================================================

export const Actions = {
  damage1: {
    name: 'Whomp!',
    description: 'A basic attack',
    success: [
      { type: 'textMessage', text: '{CASTER} uses {ACTION}!' },
      { type: 'animation', animation: 'spin' },
      { type: 'stateChange', damage: 10 },
    ],
  },
  saucyStatus: {
    name: 'Tomato Squeeze',
    description: 'Applies the Saucy status',
    targetType: 'friendly',
    success: [
      { type: 'textMessage', text: '{CASTER} uses {ACTION}!' },
      { type: 'stateChange', status: { type: 'Saucy', expiresIn: 3 } },
    ],
  },
  clumsyStatus: {
    name: 'Olive Oil',
    description: 'Slippery mess of deliciousness',
    success: [
      { type: 'textMessage', text: '{CASTER} uses {ACTION}!' },
      { type: 'animation', animation: 'glob', color: '#dafd2a' },
      { type: 'stateChange', status: { type: 'Clumsy', expiresIn: 3 } },
      { type: 'textMessage', text: '{TARGET} is slipping all around!' },
    ],
  },
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!", },
    ]
  },
  item_recoverHp: {
    name: "Parmesan",
    description: "Sprinkle parmesan all over yourself",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} sprinkles on some {ACTION}!"},
      { type: "stateChange", recover: 10 },
      { type: "textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
}

export const BattleAnimations = {
  async spin(event: any, onComplete: any) {
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
  },
  async glob(event: any, onComplete: any) {
    const { caster } = event;
    let div = document.createElement('div');
    div.classList.add('glob-orb');
    div.classList.add(caster.team === 'player' ? 'battle-glob-right' : 'battle-glob-left');

    div.innerHTML = (`
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>
    `);

    // Remove animation class when animation is fully complete
    div.addEventListener('animationend', () => {
      div.remove();
    });

    // Add 'glob' to DOM
    document.querySelector('.Battle')?.appendChild(div);

    await wait(820);
    onComplete();
  }
};

export const PizzaTypes = {
  normal: 'normal', 
  spicy: 'spicy', 
  veggie: 'veggie', 
  fungi: 'fungi', 
  chill: 'chill', 
};

export const Pizzas = {
  's001': {
    name: 'Slice Samurai',
    description: 'A pizza that lives by the sword',
    type: PizzaTypes.spicy,
    src: 'assets/pizzas/s001.png',
    icon: 'assets/pizza-icons/spicy.png',
    actions: [ 'saucyStatus', 'clumsyStatus', 'damage1', ],
  },
  's002': {
    name: 'Bacon Brigade',
    description: 'A pork-loving pizza asdf',
    type: PizzaTypes.spicy,
    src: 'assets/pizzas/s001.png',
    icon: 'assets/pizza-icons/spicy.png',
    actions: [ 'saucyStatus', 'clumsyStatus', 'damage1', ],
  },
  'v001': {
    name: 'Call Me Kale',
    description: 'A hippie pizza',
    type: PizzaTypes.veggie,
    src: 'assets/pizzas/v001.png',
    icon: 'assets/pizza-icons/veggie.png',
    actions: [ 'damage1', ],
  },
  'f001': {
    name: 'Portobello Express',
    description: 'A Joe Rogan pizza',
    type: PizzaTypes.fungi,
    src: 'assets/pizzas/f001.png',
    icon: 'assets/pizza-icons/fungi.png',
    actions: [ 'damage1', ],
  },
}

// ========== SHARED FUNCTIONS ==============================================================

export function randomFromArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function wait(ms: number): Promise<any> {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, ms)
  });
}
