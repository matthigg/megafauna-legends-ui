import { GameObject } from "./game-object.class";
import { playerState } from "../shared/player-state";
import { Actions } from "../shared/utils";
import { KeyboardMenu } from "./keyboard-menu.class";

export class Chest extends GameObject {
  stackedItems: any[] = [];
  storedItems: any[] = [];
  // x: number;
  // y: number;
  keyboardMenu: any;
  quantityMap: any = {}

  constructor(config: any) {
    super(config);

    // this.items = config.items;
    this.x = config.x;
    this.y = config.y;

    this.storedItems = config.items;

    this.keyboardMenu = new KeyboardMenu();

    this.stackItems();



    console.log('--- config.items:', config.items);
    console.log('--- this.stackedItems:', this.stackedItems);
    console.log('--- playerState.items:', playerState.items);
    
  }

  init(resolve: any): void {
    this.keyboardMenu.init(document.querySelector('.game-container'));
    this.keyboardMenu.setOptions(this.getContainerOptions(resolve).mainMenu);
  }

  stackItems(): void {
    // Condense multiple quantities of the same player items stored in playerState (ex.
    // display 'Cheese x 2' instead of 'Cheese, Cheese')
    playerState.items.forEach((item: any) => {
      // if (item.team === caster.team) {
      let existing = this.quantityMap[item.actionId];
      if (existing) {
        existing.quantity += 1;
      } else {
        this.quantityMap[item.actionId] = {
          actionId: item.actionId,
          quantity: 1,
          instanceId: item.instanceId,
        }
      }
      // }
    });
    this.stackedItems = Object.values(this.quantityMap);
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



  getContainerOptions(resolve: any) {

    // this.keyboardMenu.setOptions(this.event.getContainerOptions(resolve).mainMenu);

    // console.log('--- playerState.items:', playerState.items);
    // console.log('--- this.items:', this.items);
    
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
      ],

      // Display items in the player's inventory that can be deposited
      items: [
        ...this.stackedItems.map((item: any) => {
          
          // Note: items are stored under the shared Actions object
          const action = Actions[item.actionId as keyof typeof Actions];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.depositItem(action, item.instanceId, item.quantity, resolve);
            }
          }
        }),
        backOption,
      ],
      
    }
  }



  depositItem(action: any, instanceId = null, quantity: number, resolve: any) {
    
    // console.log('--- action:', action);
    // console.log('--- instanceId:', instanceId);
    // const x = playerState.items.find(item => item.instanceId === instanceId)
    let itemToBeDeposited: any[] = [];
    playerState.items.forEach((item, i) => {
      if (item.instanceId === instanceId) {
        if (quantity > 1) {

          // TODO - handle depositing more than 1 item at a time


        }

        
        itemToBeDeposited = playerState.items.splice(i, 1);
      }
    });

    console.log('--- playerState.items:', playerState.items);
    console.log('--- itemToBeDeposited:', itemToBeDeposited);

    let chest = (<any>window).OverworldMaps.HomeCave.gameObjects.chest1

    // console.log('--- chest:', chest);

    this.storedItems.push(...itemToBeDeposited);

    console.log('--- this.storedItems:', this.storedItems);
    
    // console.log('--- chest.items:', chest.items);
    // console.log('--- playerState:', playerState);
  
      
    this.keyboardMenu?.end();
    resolve();
  }
}