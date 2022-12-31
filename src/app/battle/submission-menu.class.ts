import { KeyboardMenu } from "../classes/keyboard-menu.class";
import { Actions } from "../shared/utils";

export class SubmissionMenu {
  caster;
  enemy;
  onComplete;
  keyboardMenu: any;

  constructor({ caster, enemy, onComplete }: any) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
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
  // on something like an enemy object. The 'target' can be anyone -- an actual enemy, a 
  // teammate, your character, etc.
  decide() {
    this.onComplete({
      action: Actions[this.caster.actions[0] as keyof typeof Actions],
      target: this.enemy,
    });
  }

  showMenu(container: any) {
    this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(container);
      this.keyboardMenu.setOptions(this.getPages().root);
  }

  getPages() {
    return {
      root: [
        {
          label: 'Attack',
          description: 'Choose an attack',
          disabled: false,
          handler: () => {
            console.log('--- go to attacks page:');
          }
        },
        {
          label: 'Items',
          description: 'Choose an item',
          disabled: false,
          handler: () => {

          }
        },
        {
          label: 'Swap',
          description: 'Change to another pizza',
          disabled: false,
          handler: () => {

          }
        },
      ],
      attacks: [

      ],
    }
  }
}