import { GameObject } from "./game-object.class";

export class Person extends GameObject {
  movingProgressRemaining;
  directionUpdate: any;

  constructor(config: any) {
    super(config);
    this.movingProgressRemaining = 64;

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
  }
}