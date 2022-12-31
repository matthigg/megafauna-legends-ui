import { KeyboardMenu } from "../classes/keyboard-menu.class";

export class ReplacementMenu {
  replacements;
  onComplete;
  keyboardMenu: any;

  constructor({ replacements, onComplete }: any) {
    this.replacements = replacements;
    this.onComplete = onComplete;
  }

  init(container: any): void {
    if (this.replacements[0].isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }

  decide() {
    this.menuSubmit(this.replacements[0])
  }

  menuSubmit(replacement: any) {
    this.keyboardMenu?.end();
    this.onComplete(replacement);
  }

  showMenu(container: any) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(
      this.replacements.map((c: any) => {
        return {
          label: c.name,
          description: c.description,
          handler: () => {
            this.menuSubmit(c)
          }
        }
      }),
    );
  }
}