import { KeyboardMenu } from "./keyboard-menu.class";

export class TitleScreen {
  keyboardMenu: any;
  progress: any;
  element: any;

  
  constructor({ progress }: any) {
    this.progress = progress;
  }

  getOptions(resolve: any) {
    const saveFile = this.progress.getSaveFile();
    return [

      // Use a ternary operator here to conditionally add the "Continue" option
      saveFile ? {
        label: "Continue",
        description: "Resume your adventure",
        handler: () => {
          this.close();

          // The saveFile is passed to the overworld component & stored as 'useSaveFile'
          resolve(saveFile);
        }
      } : null,
      
      { 
        label: "New Game",
        description: "Start a new pizza adventure",
        handler: () => {
          this.close();
          resolve();
        }
      },



      // Filter out falsy values (ie. filter out the above object if it's falsy)
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
