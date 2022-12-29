import { createMayBeForwardRefExpression } from "@angular/compiler";
import { GameObject } from "./game-object.class";
import { Person } from "./person.class";

export class OverworldMap {
  gameObjects;
  walls;
  lowerImage;
  upperImage;
  isCutscenePlaying: boolean = false;

  constructor(config: any) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

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

  isSpaceTaken(currentX: number, currentY: number, direction: string): boolean {
    const {x, y} = nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects(): void {
    Object.keys(this.gameObjects).forEach((key: string) => {

      let object = this.gameObjects[key];
      object.id = key;    // each key will probably be named 'hero', 'npc1', npc2', etc.

      // TODO: determine if this game object should mount
      
      
      object.mount(this);
    })
  }

  addWall(x: number, y: number) {
    this.walls[`${x},${y}`] = true;
  }
  
  removeWall(x: number, y: number) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX: number, wasY: number, direction: string) {
    this.removeWall(wasX, wasY);
    const {x, y} = nextPosition(wasX, wasY, direction);
    this.addWall(x, y)

    // console.log('--- this.walls:', this.walls);
  }
}

// ========== Utility Functions ===============================================================

function gridSize(n: number): number {
  return n * 32;
}

function asGridCoord(x: number, y: number): string {
  return `${x * 32},${y * 32}`
}

function nextPosition(initialX: number, initialY: number, direction: string) {
  let x = initialX;
  let y = initialY;
  const size = 32;
  if (direction === 'left') {
    x -= size;
  } else if (direction === 'right') {
    x += size;
  } else if (direction === 'up') {
    y -= size;
  } else if (direction === 'down') {
    y += size;
  }
  return {x, y};
}

// ========== Overworld Maps & Game Objects ===================================================

(<any>window).OverworldMaps = {
  DemoRoom: {
    lowerSrc: 'assets/pizza-legends-demoroom-lower-map-01.svg',
    upperSrc: 'assets/pizza-legends-demoroom-upper-map-01.svg',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: gridSize(6),
        y: gridSize(3),
        src: null,
      }),
      npc1: new Person({
        x: gridSize(6),
        y: gridSize(7),
        src: null,
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          { type: 'stand', direction: 'up', time: 5000 },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' },
        ],
      }),
      npc2: new Person({
        x: gridSize(8),
        y: gridSize(7),
        src: null,
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 5000 },
          { type: 'stand', direction: 'up', time: 300 },
        ],
      }),
    },
    walls: {
      // [asGridCoord(1,1)] : true,
      // [asGridCoord(1,2)] : true,
      // [asGridCoord(1,3)] : true,
      // [asGridCoord(1,4)] : true,
      // [asGridCoord(1,5)] : true,
      // [asGridCoord(2,1)] : true,
      // [asGridCoord(2,2)] : true,
      // [asGridCoord(2,3)] : true,
      // [asGridCoord(2,4)] : true,
      // [asGridCoord(2,5)] : true,
      // [asGridCoord(3,1)] : true,
      // [asGridCoord(3,2)] : true,
      // [asGridCoord(3,3)] : true,
      // [asGridCoord(3,4)] : true,
      // [asGridCoord(3,5)] : true,
      // [asGridCoord(4,1)] : true,
      // [asGridCoord(4,2)] : true,
      // [asGridCoord(4,3)] : true,
      // [asGridCoord(4,4)] : true,
      // [asGridCoord(4,5)] : true,
    },
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