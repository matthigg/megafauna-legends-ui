import { Sprite } from "src/app/classes/sprite.class";
import { OverworldEvent } from "./overworld-event.class";

export class GameObject {
  id: number | null = null;
  isMounted: boolean = false;
  x: number = 0;
  y: number = 0;
  direction: string = 'down';
  sprite: any = null;
  behaviorLoop: any;
  behaviorLoopIndex: any;
  talking: any;

  constructor(config: any) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || 'assets/character-01.webp',
      animations: null,
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map: any) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  async doBehaviorEvent(map: any) {

    console.log('--- game-object map:', map);

    // Short-circuit this method if a cut scene is playing or if no behavior
    // loop has been configured
    if (
      map.isCutscenePlaying || 
      this.behaviorLoop.length === 0 
      // map.isStanding -- this is supposed to fix a bug where the 'stand' behavior type in 
      // the person class startBehavior() method could lead to multiple PersonStandingComplete
      // events being emitted & setTimeout()'s stacking up

    ) {
      return;
    }

    console.log('--- BEHAVIOR LOOP RESUMES ---')

    // Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting the next event to fire once the behavior loop reaches its end
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Recursively call this method 
    this.doBehaviorEvent(map);
  }
}