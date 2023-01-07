import { KeyboardMenu } from "./keyboard-menu.class";

class TitleScreen {
  keyboardMenu: any;
  progress: any;
  element: any;

  
  constructor({ progress }: any) {
    this.progress = progress;
  }

  getOptions(resolve: any) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "New Game",
        description: "Start a new pizza adventure.",
        handler: () => {
          this.close();
          resolve();
        }
      },
      safeFile ? {
        label: "Continue Game",
        description: "Resume your adventure",
        handler: () => {
          this.close();
          resolve(safeFile);
        }
      } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="assets/images/logo.png" alt="Pizza Legends" />
    `)

  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container: any) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
    })
  }

}
