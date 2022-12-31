(<any>window).Actions = {
  damage1: {
    name: 'Whomp!',
    success: [
      { type: 'textMessage', text: '{CASTER} users Whomp!' },
      { type: 'animation', animation: 'define something here' },
      { type: 'stateChange', damage: 10 },
    ]
  }
}
