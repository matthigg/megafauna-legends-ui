import { GameObject } from "./game-object.class";
import { playerState } from "../shared/player-state";
import { Actions, Items } from "../shared/utils";
import { KeyboardMenu } from "./keyboard-menu.class";

export class Chest extends GameObject {
  storedItems: any[] = [];
  keyboardMenu: any;
  stackMap: any = {}

  constructor(config: any) {
    super(config);

    this.x = config.x;
    this.y = config.y;
    this.storedItems = config.items;
    this.keyboardMenu = new KeyboardMenu();

    console.log('--- config.items:', config.items);
    console.log('--- playerState.items:', playerState.items);
  }

  init(resolve: any): void {
    this.keyboardMenu.init(document.querySelector('.game-container'));
    this.keyboardMenu.setOptions(this.getContainerOptions(resolve).mainMenu);
  }

  // Note: this is copied from person.class.ts, and currently does nothing
  update(state: any) {
    // if (this.movingProgressRemaining > 0) {
    //   this.updatePosition();
    // } else {
    //   // Put more cases to starting to walk here
    //   // ...

    //   // If the user is pressing a direction to move in and the animation has finished via
    //   // this.movingProgressRemaining === 0, then move in that direction
    //   // Case: we're 'keyboard ready' (accepting user input) and have an arrow/WASD pressed
    //   if (state.arrow && this.isPlayerControlled && !state.map.isCutscenePlaying) {
    //     this.startBehavior(state, {
    //       type: 'walk',
    //       direction: state.arrow,
    //     });
    //   }
    //   this.updateSprite();
    // }
  }



  getContainerOptions(resolve: any, itemConfig?: any) {

    console.log('--- itemConfig:', itemConfig);
    
    const backOption = {
      label: 'Go back',
      description: 'Return to previous page',
      handler: () => {
        this.keyboardMenu.setOptions(this.getContainerOptions(resolve).mainMenu);
      }
    }

    return {
      mainMenu: [ 
        {
          label: 'Deposit',
          description: 'Place items in this chest',
          handler: () => {
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).items);
          }
        },
        {
          label: 'Withdraw',
          description: 'Take items from this chest',
          handler: () => {
  
          }
        },
        {
          label: 'Pick up chest',
          description: 'Pick up this chest',
          handler: () => {
  
          }
        },
        {
          label: 'Exit',
          description: 'Close menu',
          handler: () => {
            this.keyboardMenu?.end();
            resolve();
          }
        },
      ],

      // Display items in the player's inventory that can be deposited
      items: [
        ...playerState.items.map((playerItem: any) => {
          const itemConfig = Items[playerItem.itemId as keyof typeof Items];

          return {
            label: itemConfig.name,
            description: itemConfig.description,
            right: () => {
              return "x"+playerItem.quantity;
            },
            handler: () => {
              this.depositItem(resolve, playerItem.itemId);
            }
          }
        }),
        backOption,
      ],

      // Handle depositing multiple items
      deposit: [
        {
          label: 'Deposit all',
          description: `Place all ${itemConfig?.name} into the chest`,
          // description: `Place all into the chest`,
          handler: () => {
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).items);
          }
        },
        {
          description: `Place some ${itemConfig?.name} into the chest`,
          // description: `Place some into the chest`,
          label: 'Deposit some',
          handler: () => {
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).items);
          }
        },
        backOption,
      ],
      
    }
  }



  depositItem(resolve: any, itemId: string) {
    let depositCustomQuantity: any;
    
    playerState.items.forEach((playerItem, i) => {
      const itemConfig = Items[playerItem.itemId as keyof typeof Items];

      if (playerItem.itemId === itemId) {

        if (playerItem.quantity > 1) {

          // console.log('--- playerItem:', playerItem);

          // this.keyboardMenu?.end();
          // resolve();
          depositCustomQuantity = itemConfig;
          
          
        }

        this.storedItems.push(playerItem)
        playerState.items.splice(i, 1);

        // console.log('--- this.storedItems:', this.storedItems);
        // console.log('--- playerState.items:', playerState.items);
      }

    });

    if (depositCustomQuantity) {
      this.keyboardMenu.setOptions(this.getContainerOptions(resolve, depositCustomQuantity).deposit);
    }

    let chest = (<any>window).OverworldMaps.HomeCave.gameObjects.chest1
      
    // this.keyboardMenu?.end();
    // resolve();
  }
}
