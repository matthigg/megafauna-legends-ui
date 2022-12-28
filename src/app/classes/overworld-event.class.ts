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
      let key = this.event.type
      this[key as keyof OverworldEventModel](resolve);
    })
  }

  stand(resolve: any) {

  }

  walk(resolve: any) {
    const who = this.map.gameObjects[this.event.who];
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
    // event 
    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    }

    document.addEventListener('PersonWalkingComplete', completeHandler);
  }
}