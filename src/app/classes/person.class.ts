import { GameObject } from "./game-object.class";
import { emitEvent } from "../shared/utils";

export class Person extends GameObject {
  movingProgressRemaining: number = 0;
  // isStanding: boolean = false;
  isPlayerControlled: boolean = false;

  directionUpdate: any = {
    'up': ['y', -1],
    'down': ['y', 1],
    'left': ['x', -1],
    'right': ['x', 1],
  }

  constructor(config: any) {
    super(config);

    this.isPlayerControlled = config.isPlayerControlled || false;
  }

  startBehavior(state: any, behavior: any) {

    // Set character direction based on behavior
    this.direction = behavior.direction;

    if (behavior.type === 'walk') {

      // Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

        // If an npc is walking via their behaviorLoop but gets blocked, retry walking after
        // a set amount of time (10ms in this case)
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior);
        }, 10)
        return;
      }

      // Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 32;
      this.updateSprite();
    }

    if (behavior.type === 'stand') {

      // Setting this to true or false is supposed to squash some bug by preventing the
      // setTimeout()'s from stacking up. It's a property in the game-object class, which
      // this Person class inherits
      this.isStanding = true;
      setTimeout(() => {
        emitEvent('PersonStandingComplete', { whoId: this.id });
        this.isStanding = false;
      }, behavior.time);
    }
  }
  
  updatePosition(): void {
    const [ property, change ] = this.directionUpdate[this.direction];
    (this as any)[property] += change;
    this.movingProgressRemaining -= 1;

    // We finished the walk! Part 7 - 19:00
    if (this.movingProgressRemaining === 0) {
      emitEvent('PersonWalkingComplete', { whoId: this.id });
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }

  update(state: any) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // Put more cases to starting to walk here
      // ...

      // If the user is pressing a direction to move in and the animation has finished via
      // this.movingProgressRemaining === 0, then move in that direction
      // Case: we're 'keyboard ready' (accepting user input) and have an arrow/WASD pressed
      if (state.arrow && this.isPlayerControlled && !state.map.isCutscenePlaying) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }
}

// ========== Utility Functions ===============================================================

// function emitEvent(name: string, detail: any) {
//   const event = new CustomEvent(name, { detail });
//   document.dispatchEvent(event);
// }
