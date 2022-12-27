import { GameObject } from "./game-object.class";

export class OverworldMap {
  gameObject;
  lowerImage;
  upperImage;

  constructor(config: any) {
    this.gameObject = config.gameObject;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: 'assets/overworld-map-01.svg',
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 3,
        src: null,
      }),
      npc1: new GameObject({
        x: 5,
        y: 5,
        src: null,
      }),
    }
  },
  Kitchen: {
    lowerSrc: 'assets/overworld-map-01.svg',
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 7,
        src: null,
      }),
      npc1: new GameObject({
        x: 4,
        y: 8,
        src: null,
      }),
      npc2: new GameObject({
        x: 7,
        y: 7,
        src: null,
      }),
    }
  },
}