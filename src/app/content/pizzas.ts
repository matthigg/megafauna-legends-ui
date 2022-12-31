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
