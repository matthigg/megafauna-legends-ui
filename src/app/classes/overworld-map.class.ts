import { createMayBeForwardRefExpression } from "@angular/compiler";
import { GameObject } from "./game-object.class";
import { Person } from "./person.class";

export class OverworldMap {
  gameObjects;
  lowerImage;
  upperImage;

  constructor(config: any) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: any) {
    ctx.drawImage(
      this.lowerImage, 
      gridSize(10.5) - cameraPerson.x, 
      gridSize(9) - cameraPerson.y, 
    );
  }

  drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: any) {
    ctx.drawImage(
      this.upperImage, 
      gridSize(10.5) - cameraPerson.x, 
      gridSize(9) - cameraPerson.y, 
    );
  }
}

function gridSize(n: number): number {
  return n * 32;
}

(<any>window).OverworldMaps = {
  DemoRoom: {
    lowerSrc: 'assets/pizza-legends-demoroom-lower-map-01.svg',
    upperSrc: 'assets/pizza-legends-demoroom-upper-map-01.svg',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: gridSize(3),
        y: gridSize(3),
        src: null,
      }),
      npc1: new Person({
        x: gridSize(5),
        y: gridSize(5),
        src: null,
      }),
    }
  },
  Kitchen: {
    lowerSrc: 'assets/pizza-legends-demoroom-lower-map-01.svg',
    upperSrc: 'assets/pizza-legends-demoroom-upper-map-01.svg',
    gameObjects: {
      hero: new Person({
        x: gridSize(3),
        y: gridSize(7),
        src: null,
      }),
      npc1: new Person({
        x: gridSize(4),
        y: gridSize(8),
        src: null,
      }),
      npc2: new Person({
        x: gridSize(7),
        y: gridSize(7),
        src: null,
      }),
    }
  },
}