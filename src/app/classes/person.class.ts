import { GameObject } from "./game-object.class";

export class Person extends GameObject {
  movingProgressRemaining: number = 32;
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
        return;
      }

      // Ready to walk
      this.movingProgressRemaining = 32;
    }
  }
  
  updatePosition(): void {
    const [ property, change ] = this.directionUpdate[this.direction];
    (this as any)[property] += change;
    this.movingProgressRemaining -= 1;
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
