[1mdiff --git a/src/app/classes/chest.class.ts b/src/app/classes/chest.class.ts[m
[1mindex 9f6011a..4eb7f5d 100644[m
[1m--- a/src/app/classes/chest.class.ts[m
[1m+++ b/src/app/classes/chest.class.ts[m
[36m@@ -79,21 +79,28 @@[m [mexport class Chest extends GameObject {[m
           label: 'Deposit',[m
           description: 'Place items in this chest',[m
           handler: () => {[m
[31m-            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).items);[m
[32m+[m[32m            // this.keyboardMenu.setOptions(this.getContainerOptions(resolve).playerItems);[m
           }[m
         },[m
         {[m
           label: 'Withdraw',[m
           description: 'Take items from this chest',[m
           handler: () => {[m
[31m-  [m
[32m+[m
[32m+[m[32m            console.log('--- WITHDRAW this.storedItems:', this.storedItems);[m
[32m+[m[41m            [m
[32m+[m[32m            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).chestItems);[m
[32m+[m[32m            // this.keyboardMenu.setOptions(this.getContainerOptions(resolve));[m
           }[m
         },[m
         {[m
           label: 'Pick up chest',[m
           description: 'Pick up this chest',[m
           handler: () => {[m
[31m-  [m
[32m+[m
[32m+[m[32m            console.log('--- PICK UP this.storedItems:', this.storedItems);[m
[32m+[m
[32m+[m[32m            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).chestItems);[m
           }[m
         },[m
         {[m
[36m@@ -107,8 +114,11 @@[m [mexport class Chest extends GameObject {[m
       ],[m
 [m
       // Display items in the player's inventory that can be deposited[m
[31m-      items: [[m
[32m+[m[32m      playerItems: [[m
         ...playerState.items.map((playerItem: any) => {[m
[32m+[m
[32m+[m[32m          // console.log('--- playerItem:', playerItem);[m
[32m+[m[41m          [m
           const itemConfig = Items[playerItem.itemId as keyof typeof Items];[m
 [m
           return {[m
[36m@@ -132,7 +142,7 @@[m [mexport class Chest extends GameObject {[m
           description: `Place all ${itemConfig?.name} into the chest`,[m
           handler: () => {[m
             this.depositAllItems(depositedPlayerItem, depositedPlayerItemIndex);[m
[31m-            this.keyboardMenu.setOptions(this.getContainerOptions(resolve).items);[m
[32m+[m[32m            // this.keyboardMenu.setOptions(this.getContainerOptions(resolve).playerItems);[m
           }[m
         },[m
         {[m
[36m@@ -172,11 +182,35 @@[m [mexport class Chest extends GameObject {[m
                     }[m
               }[m
             });[m
[31m-            this.keyboardMenu.setOptions(this.getContainerOptions(resolve, itemConfig).items);[m
[32m+[m[32m            // this.keyboardMenu.setOptions(this.getContainerOptions(resolve, itemConfig).playerItems);[m
           }[m
         },[m
         backOption,[m
       ],[m
[32m+[m
[32m+[m[32m      // Display items in a chest that can be withdrawn[m
[32m+[m[32m      chestItems: [[m
[32m+[m[32m        // ...playerState.items.map((playerItem: any) => {[m
[32m+[m[32m        //   const itemConfig = Items[playerItem.itemId as keyof typeof Items];[m
[32m+[m
[32m+[m[32m        //   return {[m
[32m+[m[32m        //     label: itemConfig.name,[m
[32m+[m[32m        //     description: itemConfig.description,[m
[32m+[m[32m        //     right: () => {[m
[32m+[m[32m        //       return "x"+playerItem.quantity;[m
[32m+[m[32m        //     },[m
[32m+[m[32m        //     handler: () => {[m
[32m+[m[32m        //       this.depositItem(resolve, playerItem.itemId);[m
[32m+[m[32m        //     }[m
[32m+[m[32m        //   }[m
[32m+[m[32m        // }),[m
[32m+[m[41m        [m
[32m+[m
[32m+[m[32m        ...Object.keys(this.storedItems).map((storedItem: any) => {[m
[32m+[m[32m          console.log('--- storedItem:', storedItem);[m
[32m+[m[32m        }),[m
[32m+[m[32m        backOption,[m
[32m+[m[32m      ],[m
     }[m
   }[m
 [m
[36m@@ -220,7 +254,7 @@[m [mexport class Chest extends GameObject {[m
         depositedPlayerItemIndex[m
       ).deposit);[m
     } else {[m
[31m-      this.keyboardMenu.setOptions(this.getContainerOptions(resolve, itemConfig).items);[m
[32m+[m[32m      // this.keyboardMenu.setOptions(this.getContainerOptions(resolve, itemConfig).playerItems);[m
     }[m
 [m
     // let chest = (<any>window).OverworldMaps.HomeCave.gameObjects.chest1[m
[1mdiff --git a/src/app/classes/keyboard-menu.class.ts b/src/app/classes/keyboard-menu.class.ts[m
[1mindex 6e31535..295182e 100644[m
[1m--- a/src/app/classes/keyboard-menu.class.ts[m
[1m+++ b/src/app/classes/keyboard-menu.class.ts[m
[36m@@ -108,6 +108,8 @@[m [mexport class KeyboardMenu {[m
       button.addEventListener('click', () => {[m
         const chosenOption = this.options[ Number(button.dataset.button) ];[m
         chosenOption.handler();[m
[32m+[m
[32m+[m[32m        // console.log('--- chosenOption:', chosenOption);[m
       });[m
 [m
       // Note: button.focus() adds :focus-visible { outline: ... } via the user [m
[36m@@ -123,7 +125,7 @@[m [mexport class KeyboardMenu {[m
 [m
     // Focus on the first <button> element with the data-button attribute that is not disabled[m
     setTimeout(() => {[m
[31m-      const focusButtonDisasbled = this.element.querySelector("button:not([disabled])").focus();[m
[32m+[m[32m      const focusButton = this.element.querySelector("button:not([disabled])").focus();[m
     });[m
   }[m
 [m
