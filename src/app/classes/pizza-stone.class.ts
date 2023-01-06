import { GameObject } from "./game-object.class";
import { Sprite } from "./sprite.class";
import { playerState } from "../shared/player-state";

export class PizzaStone extends GameObject {
  storyFlag;
  pizzas;

  constructor(config: any) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      // src: "assets/pizza-stone.png",
      src: "assets/character-01.webp",
      animations: {
        "used-down"   : [ [0, 0] ],
        "unused-down" : [ [1, 0] ],
      },
      currentAnimation: "used-down"
    });
    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: "textMessage", text: "You have already used this." },
        ]
      },
      {
        events: [
          { type: "textMessage", text: "Approaching the legendary pizza stone..." },
          { type: "craftingMenu", pizzas: this.pizzas },
          { type: "addStoryFlag", flag: this.storyFlag },
        ]
      }
    ]

  }

  update() {
    this.sprite.currentAnimation = (playerState.storyFlags as any)[this.storyFlag]
     ? "used-down"
     : "unused-down";
   }
}