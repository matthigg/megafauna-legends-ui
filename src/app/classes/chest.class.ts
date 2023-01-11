import { GameObject } from "./game-object.class";
import { playerState } from "../shared/player-state";
import { Actions, Items } from "../shared/utils";
import { KeyboardMenu } from "./keyboard-menu.class";

interface StoredItemsModel {
  [key: string]: { itemId: string, quantity: number }
}

export class Chest extends GameObject {
  storedItems: StoredItemsModel = {};
  keyboardMenu: any;
  depositedItemConfig: any;
  depositedPlayerItem: any;

  obj = {
    test() {return 'asdf' }
  }

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



  getContainerOptions(
    resolve: any, 
    itemConfig?: any, 
    depositedPlayerItem?: any, 
    depositedPlayerItemIndex?: number
  ) {

    // console.log('--- itemConfig:', itemConfig);
    // console.log('--- depositedPlayerItem:', depositedPlayerItem);
    
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
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).playerItems);
            
            this.clearDepositedItem();
          }
        },
        {
          label: 'Withdraw',
          description: 'Take items from this chest',
          handler: () => {
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).chestItems);
          }
        },
        {
          label: 'Pick up chest',
          description: 'Pick up this chest',
          handler: () => {
            // this.keyboardMenu.setOptions(this.getContainerOptions(resolve).chestItems);
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
      playerItems: [
        ...playerState.items.map((playerItem: any) => {
          const playerItemConfig = Items[playerItem.itemId as keyof typeof Items];
          return {
            label: playerItemConfig.name,
            description: playerItemConfig.description,
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
          description: `Place all ${this.depositedItemConfig?.name} into the chest`,
          handler: () => {
            this.depositAllItems(this.depositedPlayerItem, depositedPlayerItemIndex);
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).playerItems);
            
            this.clearDepositedItem();
          }
        },
        {
          description: `Place some ${this.depositedItemConfig?.name} into the chest`,
          label: 'Deposit some',
          handler: () => {
            this.keyboardMenu.setOptionsRangeSlider(
              this.getContainerOptions(
                resolve, 
                this.depositedItemConfig, 
                this.depositedPlayerItem
              ).depositSome, 
              this.depositedItemConfig, 
              this.depositedPlayerItem
            );
          }
        },
        backOption,
      ],

      // Handle depositing a partial amount of items
      depositSome: [
        {
          label: 'Place items in chest',
          description: `Place some ${this.depositedItemConfig?.name} into the chest`,
          handler: (depositedPlayerItem: any, depositedQuantity: number) => {
            playerState.items.forEach((playerItem, i) => {
              if (playerItem.itemId === this.depositedPlayerItem.itemId) {
                playerItem.quantity -= depositedQuantity
                if (playerItem.quantity === 0) playerState.items.splice(i, 1);

                this.storedItems[playerItem.itemId]
                  ? this.storedItems[playerItem.itemId].quantity += +depositedQuantity
                  : this.storedItems[playerItem.itemId] = {
                      itemId: playerItem.itemId, 
                      quantity: +depositedQuantity
                    }
              }
            });
            this.keyboardMenu.setOptions(this.getContainerOptions(resolve, this.depositedItemConfig).playerItems);
            
            this.clearDepositedItem();
          }
        },
        backOption,
      ],

      // Display items in a chest that can be withdrawn
      chestItems: [
        ...Object.keys(this.storedItems).map((storedItem: any) => {
          const chestItemConfig = Items[storedItem as keyof typeof Items];
          return {
            label: chestItemConfig.name,
            description: chestItemConfig.description,
            right: () => {
              return "x"+this.storedItems[storedItem].quantity;
            },
            handler: () => {
              this.depositItem(resolve, storedItem.itemId);
            }
          }
        }),
        backOption,
      ],
    }
  }

  depositAllItems(depositedPlayerItem: any, depositedPlayerItemIndex: any): void {
    this.storedItems[this.depositedPlayerItem.itemId] = this.depositedPlayerItem;
    if (depositedPlayerItemIndex >= 0) {
      playerState.items.splice(depositedPlayerItemIndex, 1);
    }
  }

  depositItem(resolve: any, itemId: string) {
    let isCustomDepositQuantity: boolean | null = null;
    // let itemConfig: any;
    let depositedItemName: string | null = null;
    // let depositedPlayerItem: any;
    let depositedPlayerItemIndex: any;
    
    playerState.items.forEach((playerItem, i) => {
      if (playerItem.itemId === itemId) {
        this.depositedItemConfig = Items[playerItem.itemId as keyof typeof Items];
        if (playerItem.quantity > 1) {
          isCustomDepositQuantity = true;
          this.depositedPlayerItem = playerItem;
          depositedPlayerItemIndex = i;
        } else {
          this.storedItems[playerItem.itemId] = playerItem;
          playerState.items.splice(i, 1);
        }

        // The quantity here isn't accurate if player deposits a custom amount of items
        // TODO - create message/alert popup to display depositedItemName
        depositedItemName = this.depositedItemConfig.name + ' x' + playerItem.quantity;
      }
    });

    if (isCustomDepositQuantity) {
      this.keyboardMenu.setOptions(this.getContainerOptions(
        resolve, 
        this.depositedItemConfig, 
        this.depositedPlayerItem, 
        depositedPlayerItemIndex
      ).deposit);
    } else {
      this.keyboardMenu.setOptions(this.getContainerOptions(resolve, this.depositedItemConfig).playerItems);
      
      this.clearDepositedItem();
    }

    // let chest = (<any>window).OverworldMaps.HomeCave.gameObjects.chest1
  }

  clearDepositedItem(): void {
    this.depositedItemConfig = null;
    this.depositedPlayerItem = null;
  }
}
