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
    type: PizzaTypes.spicy,
    src: 'assets/pizzas/s001.png',
    icon: 'assets/pizza-icons/spicy.png',
    actions: [ 'damage1', ],
  },
  'v001': {
    name: 'Call Me Kale',
    type: PizzaTypes.veggie,
    src: 'assets/pizzas/v001.png',
    icon: 'assets/pizza-icons/veggie.png',
    actions: [ 'damage1', ],
  },
  'f001': {
    name: 'Portobello Express',
    type: PizzaTypes.fungi,
    src: 'assets/pizzas/f001.png',
    icon: 'assets/pizza-icons/fungi.png',
    actions: [ 'damage1', ],
  },
}
