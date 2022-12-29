import { GameObject } from "./game-object.class";

export class Person extends GameObject {
  movingProgressRemaining: number = 0;
  directionUpdate: any = {
    'up': ['y', -1],
    'down': ['y', 1],
    'left': ['x', -1],
    'right': ['x', 1],
  }
  isPlayerControlled: boolean = false;

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
        // a set amount of time (100ms in this case)
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior);
        }, 100)
        return;
      }

      // Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 32;
      this.updateSprite();
    }

    if (behavior.type === 'stand') {
      setTimeout(() => {
        emitEvent('PersonStandingComplete', {
          detail: {
            whoId: this.id,
          },
        });
      }, behavior.time);
    }
  }
  
  updatePosition(): void {
    const [ property, change ] = this.directionUpdate[this.direction];
    (this as any)[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {

      // We finished the walk!
      emitEvent('PersonWalkingComplete', {
        detail: {
          whoId: this.id
        }
      });
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
      if (state.arrow && this.isPlayerControlled) {
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

// function emitEvent(name: any, { detail }: any) {
// function emitEvent(name: string, test: any) {
function emitEvent(name: any, detail: any) {

  // console.log('--- detail:', detail);
  // console.log('--- name:', name);
  // console.log('--- test:', test);
  
  const event = new CustomEvent(name, detail);

  // console.log('--- event:', event);


  document.dispatchEvent(event);
}