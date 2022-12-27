import { Sprite } from "src/app/classes/sprite.class";

export class GameObject {
  x: number = 0;
  y: number = 0;
  direction: string = 'down';
  sprite: any = null;

  constructor(config: any) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || 'assets/character-01.webp',
      animations: null,
    });
  }

  // update(): void {

  // }
}