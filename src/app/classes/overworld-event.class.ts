import { Battle } from "../battle/battle.class";
import { SceneTransition } from "./scene-transition.class";
import { TextMessage } from "./text-message.class";
import { Enemies } from "../shared/utils";
import { PauseMenu } from "./pause-menu.class";
import { playerState } from "../shared/player-state";

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
      this[key as keyof OverworldEvent](resolve);
    });
  }

  stand(resolve: any): void {
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

  walk(resolve: any): void {
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

  textMessage(resolve: any): void {
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

  changeMap(resolve: any): void {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      
      this.map.overworld.startMap((<any>window).OverworldMaps[this.event.map]);
      resolve();

      sceneTransition.fadeOut();
    });
    

  }

  battle(resolve: any): void {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId as keyof typeof Enemies],
      onComplete: (wonBattle: boolean) => {
        resolve(wonBattle ? 'WON_BATTLE' : 'LOST_BATTLE');
      }
    });
    // const battle = new Battle();
    battle.init(document.querySelector('.game-container'));
  }

  pause(resolve: any): void {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
    });
    menu.init(document.querySelector('.game-container'));
  }

  addStoryFlag(resolve: any): void {
    (playerState.storyFlags as any)[this.event.flag] = true;
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
