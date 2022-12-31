import { KeyboardMenu } from "../classes/keyboard-menu.class";
import { Actions } from "../shared/utils";

export class SubmissionMenu {
  caster;
  enemy;
  onComplete;
  keyboardMenu: any;
  items;

  constructor({ caster, enemy, onComplete, items }: any) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;

    let quantityMap: any = {}
    items.forEach((item: any) => {
      if (item.team === caster.team) {

        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
        }
      }
    });
    this.items = Object.values(quantityMap);
  }

  init(container: any) {

    if (this.caster.isPlayerControlled) {

      // Show some UI to allow player to make combat decisions
      this.showMenu(container);

    } else {
      this.decide();
    }
  }

  // This method simulates an enemy decision -- in a larger game, this probably would exist
  // on something like an enemy object. 
  decide() {
    // this.onComplete({
    //   action: Actions[this.caster.actions[0] as keyof typeof Actions],
    //   target: this.enemy,
    // });
    this.menuSubmit(Actions[this.caster.actions[0] as keyof typeof Actions]);
  }

  showMenu(container: any) {
    this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(container);
      this.keyboardMenu.setOptions(this.getPages().root);
  }

  getPages() {

    const backOption = {
      label: 'Go back',
      description: 'Return to previous page',
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      }
    }
    
    return {

      // Display the default options in the submission menu
      root: [
        {
          label: 'Attack',
          description: 'Choose an attack',
          disabled: false,
          handler: () => {
            
            // Do something when chosen
            this.keyboardMenu.setOptions(this.getPages().attacks);
          }
        },
        {
          label: 'Items',
          description: 'Choose an item',
          disabled: false,
          handler: () => {

            // Go to items page
            this.keyboardMenu.setOptions(this.getPages().items);
          }
        },
        {
          label: 'Swap',
          description: 'Change to another pizza',
          disabled: false,
          handler: () => {

            // See pizza options

          }
        },
      ],

      // Display attack options in the submission menu
      attacks: [
        ...this.caster.actions.map((key: any) => {
          const action = Actions[key as keyof typeof Actions];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption,
      ],
      items: [
        ...this.items.map((item: any) => {
          const action = Actions[item.actionId as keyof typeof Actions];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption,
      ]
    }
  }

  menuSubmit(action: any, instanceId = null) {

    console.log('--- instanceId:', instanceId);

    this.keyboardMenu?.end();
    
    this.onComplete({
      action,
      target: action.targetType === 'friendly' ? this.caster : this.enemy,
      instanceId,
    })
  }


}
