import { GameObject } from "./game-object.class";
import { OverworldEvent } from "./overworld-event.class";
import { Person } from "./person.class";
import { playerState } from "../shared/player-state";
import { PizzaStone } from "./pizza-stone.class";

export class OverworldMap {
  gameObjects;
  walls;
  lowerImage;
  upperImage;
  isCutscenePlaying: boolean = false;
  cutsceneSpaces;
  overworld: any = null;
  isPaused: boolean;

  constructor(config: any) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.isPaused = false;
  }

  drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: any) {
    ctx.drawImage(
      this.lowerImage, 
      convertToPx(10.5) - cameraPerson.x, 
      convertToPx(9) - cameraPerson.y, 
    );
  }

  drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: any) {
    ctx.drawImage(
      this.upperImage, 
      convertToPx(10.5) - cameraPerson.x, 
      convertToPx(9) - cameraPerson.y, 
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
    this.addWall(x, y);
  }

  checkForActionCutscene(): any {
    const hero = this.gameObjects['hero'];
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);

    // Search through gameObjects to see if any existing game object coords, usually NPC
    // coords, match where the hero is trying to move to via nextPosition()
    const match: any = Object.values(this.gameObjects).find((object: any) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (match && match.talking.length && !this.isCutscenePlaying) {

      const relevantScenario = match.talking.find((scenario: any) => {
        return (scenario.required || []).every((storyFlag: any) => {
          return (playerState.storyFlags as any)[storyFlag];
        })
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene(): any {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (match && !this.isCutscenePlaying) {
      this.startCutscene(match[0].events);
    }
  }

  async startCutscene(events: any[]) {
    this.isCutscenePlaying = true;

    // Start a loop of async events & await results from each
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i],
      });
      const result = await eventHandler.init();

      // This result value comes from battle.class.ts in the TurnCycle object, specifically
      // this.onComplete(winner === 'player'); -- next, it ends up in the battle() method
      // in the overworld-event-class.ts file. finally, it ends up here.
      if (result === 'LOST_BATTLE') {
        break;
      }
    }
    this.isCutscenePlaying = false;

    // Reset NPCs so they can resume their idle behavior
    // TODO - this seems to be bugged -- triggering a behavior.type === textMessage causes
    // unexpected animations & behavior loops start firing off rapidly
    Object.values(this.gameObjects).forEach((object: any) => {
      object.doBehaviorEvent(this);
    });

  }
}

// ========== Utility Functions ===============================================================

// TODO - for some reason, loading moving NPCs on some maps throws off their alignment --
// they will not move in increments of the grid size of the map (ex. 32px) but instead their
// alignment will be off by 2 pixels, meaning that their behavior loop and interaction 
// cutscenes will be broken since they check against coordinates that are multiples of the
// grid size. A temporary fix could be placed here to try to 'normalize' abberant coordinates.
function convertToPx(n: number): number {
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
    id: 'DemoRoom',
    lowerSrc: 'assets/pizza-legends-demoroom-lower-map-01.svg',
    upperSrc: '',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: convertToPx(13),
        y: convertToPx(14),
        src: null,
      }),
      npc1: new Person({
        x: convertToPx(9),
        y: convertToPx(11),
        src: null,
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          { type: 'stand', direction: 'up', time: 3000 },
          { type: 'walk', direction: 'up' },
          { type: 'stand', direction: 'right', time: 3000 },
          { type: 'walk', direction: 'right' },
          { type: 'stand', direction: 'down', time: 3000 },
          { type: 'walk', direction: 'down' },
          { type: 'stand', direction: 'left', time: 3000 },
        ],
        talking: [
          {
            events: [
              { type: 'textMessage', text: 'Running around!', faceHero: 'npc1'},
              { type: 'textMessage', text: 'Still running around!'},
            ],
          },
        ],
      }),
      npc2: new Person({
        x: convertToPx(17),
        y: convertToPx(11),
        src: null,
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 5000 },
          { type: 'stand', direction: 'up', time: 300 },
        ],
        talking: [
          {
            required: ['TALKED_TO_ERIO'],
            events: [
              { type: 'textMessage', text: "Isn't Erio the coolest?", faceHero: 'npc2'},

            ],
          },
          {
            events: [
              // { type: 'textMessage', text: "Have you met Erio?", faceHero: 'npc2'},
              { type: 'textMessage', text: "I'm going to crush you?", faceHero: 'npc2'},
              { type: 'battle', enemyId: 'beth' },
              { type: 'addStoryFlag', flag: 'DEFEATED_BETH'},
              { type: 'textMessage', text: "You crushed me?", faceHero: 'npc2'},
            ],
          },
        ],
      }),
      npc3: new Person({
        x: convertToPx(17),
        y: convertToPx(9),
        src: null,
        talking: [
          {
            events: [
              { type: 'textMessage', text: 'Bahahaha?', faceHero: 'npc3'},
              { type: 'addStoryFlag', flag: 'TALKED_TO_ERIO'},
            ],
          },
        ],
      }),
      pizzaStone: new PizzaStone({
        x: convertToPx(4),
        y: convertToPx(10),
        storyFlag: "USED_PIZZA_STONE",
        pizzas: ['v001', 'f001'],
      }),
    },
    walls: {
      [asGridCoord(8,7)] : true,
      [asGridCoord(9,7)] : true,
      [asGridCoord(17,7)] : true,
      [asGridCoord(18,7)] : true,
      [asGridCoord(8,12)] : true,
      [asGridCoord(9,12)] : true,
      [asGridCoord(17,12)] : true,
      [asGridCoord(18,12)] : true,
    },
    cutsceneSpaces: {
      [asGridCoord(5,1)]: [
        {
          events: [
            { who: 'npc2', type: 'walk', direction: 'up' },
            { who: 'npc2', type: 'stand', direction: 'up' },
            { who: 'npc2', type: 'textMessage', text: 'You cannot be in there!'},
            { who: 'npc2', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'down' },
          ],
        },
      ],
      [asGridCoord(13,17)]: [
        {
          events: [
            // { type: 'changeMap', map: 'Kitchen' },
            { 
              type: "changeMap", 
              map: "Kitchen",
              x: convertToPx(13),
              y: convertToPx(1), 
              direction: "down"
            }
          ],
        },
      ],
    },
  },
  Kitchen: {
    id: 'Kitchen',
    lowerSrc: 'assets/pizza-legends-kitchen-lower-map-01.svg',
    upperSrc: '',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: convertToPx(13),
        y: convertToPx(1),
        src: null,
      }),
      npc3: new Person({
        x: convertToPx(8),
        y: convertToPx(6),
        src: null,
        talking: [
          {
            events: [
              { type: 'textMessage', text: 'Greetings!', faceHero: 'npc3'},
            ],
          },
        ],
      }),
    },
    walls: {
      [asGridCoord(8,7)] : true,
      [asGridCoord(9,7)] : true,
      [asGridCoord(17,7)] : true,
      [asGridCoord(18,7)] : true,
      [asGridCoord(8,12)] : true,
      [asGridCoord(9,12)] : true,
      [asGridCoord(17,12)] : true,
      [asGridCoord(18,12)] : true,
    },
    cutsceneSpaces: {
      [asGridCoord(13,1)]: [
        {
          events: [
            // { type: 'changeMap', map: 'DemoRoom' },
            { 
              type: "changeMap", 
              map: "DemoRoom",
              x: convertToPx(13),
              y: convertToPx(17), 
              direction: "up"
            }
          ],
        },
      ],
    },
  },
  Street: {
    id: "Street",
    lowerSrc: "assets/images/maps/StreetLower.png",
    upperSrc: "assets/images/maps/StreetUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: convertToPx(9),
        y: convertToPx(9),
      })
    },
    cutsceneSpaces: {
      [asGridCoord(7, 9)]: [
        {
          events: [
            { 
              type: "changeMap",
              map: "Kitchen",
              x: convertToPx(7),
              y: convertToPx(9), 
              direction: "up"
            }
          ]
        }
      ]
    }
  }
}
