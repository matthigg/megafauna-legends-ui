import { TextMessage } from "./text-message.class";

interface OverworldEventModel {
  map: any,
  event: any,
}

export class OverworldEvent {
  map;
  event;

  constructor({ map, event }: any) {
    this.map = map;
    this.event = event;
  }

  init(): Promise<any> {
    return new Promise(resolve => {
      let key = this.event.type
      this[key as keyof OverworldEventModel](resolve);
    });
  }

  stand(resolve: any) {
    const who = this.map.gameObjects[this.event.who];
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
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve();
      }
    }

    document.addEventListener('PersonStandingComplete', completeHandler);
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
        retry: true,
      },
    );

    // Set up a handler to complete when the correct person, identified by who & whoId, is 
    // done walking, then resolve the event/Promise
    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    }

    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  textMessage(resolve: any) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = oppositeDirection(this.map.gameObjects['hero'].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector('.game-container'));
  }

  changeMap(resolve: any) {
    this.map.overworld.startMap((<any>window).OverworldMaps[this.event.map]);
    resolve();
  }
}

// ========== Utility Functions ===============================================================

function oppositeDirection(direction: string) {
  if (direction === 'left') { return 'right' }
  if (direction === 'right') { return 'left' }
  if (direction === 'up') { return 'down' }
  return 'up'
}
