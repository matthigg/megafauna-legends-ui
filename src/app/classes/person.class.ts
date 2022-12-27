import { GameObject } from "./game-object.class";

export class Person extends GameObject {
  movingProgressRemaining: number = 32;
  directionUpdate: any;

  constructor(config: any) {
    super(config);

    this.directionUpdate = {
      'up': ['y', -1],
      'down': ['y', 1],
      'left': ['x', -1],
      'right': ['x', 1],
    }
  }

  updatePosition(): void {
    if (this.movingProgressRemaining > 0) {
      const [ property, change ] = this.directionUpdate[this.direction];
      (this as any)[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  update(state: any) {
    this.updatePosition();

    // If the user is pressing a direction to move in and the animation has finished via
    // this.movingProgressRemaining === 0, then move in that direction
    if (state.arrow && this.movingProgressRemaining === 0) {
      this.direction = state.arrow;
      this.movingProgressRemaining = 32;
    }
  }
}