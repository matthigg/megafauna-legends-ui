interface OverworldEventModel {
  map: any,
  event: any,
  init: any,
  stand: any,
  walk: any,
}

export class OverworldEvent {
  map;
  event;

  // constructor(map: any, event: { [key in string]?: any }) {
  constructor({ map, event }: any) {
    this.map = map;
    this.event = event;
  }

  init(): Promise<any> {
    return new Promise(resolve => {

      // console.log('--- resolve:', resolve);
      
      let key = this.event.type

      // console.log('--- key:', key);


      this[key as keyof OverworldEventModel](resolve);
    });
  }

  stand(resolve: any) {
    const who = this.map.gameObjects[this.event.who];

    // console.log('--- who:', who);
    
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: 'stand',
        direction: this.event.direction,
        time: this.event.time,
      },
    );

    // Set up a handler to complete when correct person is done walking, then resolve the
    // event/Promise
    const completeHandler = (e: any) => {
      // console.log('--- e:', e);
      // console.log('--- this.event.who:', this.event.who);
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve();
      }
    }

    document.addEventListener('PersonStandingComplete', completeHandler);
  }

  walk(resolve: any) {
    const who = this.map.gameObjects[this.event.who];

    // console.log('--- who:', who);
    
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: 'walk',
        direction: this.event.direction,
      },
    );

    // Set up a handler to complete when correct person is done walking, then resolve the
    // event/Promise
    const completeHandler = (e: any) => {
      // console.log('--- e:', e);
      // console.log('--- this.event.who:', this.event.who);
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    }

    document.addEventListener('PersonWalkingComplete', completeHandler);
  }
}