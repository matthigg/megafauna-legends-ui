import { InteractivityChecker } from "@angular/cdk/a11y";

export class DirectionInput {
  heldDirections: any[] = [];
  map = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'KeyW': 'up',
    'KeyS': 'down',
    'KeyA': 'left',
    'KeyD': 'right',
  }

  constructor() {}

  init() {
    document.addEventListener('keydown', e => {
      const direction = this.map[e.code as keyof Object];
      if (direction && !this.heldDirections.includes(direction)) {
        this.heldDirections.unshift(direction);
      }
    });

    document.addEventListener('keyup', e => {
      const direction = this.map[e.code as keyof Object];
      const index = this.heldDirections.indexOf(direction);
      if (index > -1) {
        this.heldDirections.splice(index, 1);

      }
    })
  }

  get direction(): string {
    return this.heldDirections[0];
  }
}
