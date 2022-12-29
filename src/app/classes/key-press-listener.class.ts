export class KeyPressListener {
  keydownFunction: any;
  keyupFunction: any;

  constructor(keyCode: any, callback: any) {
    let keySafe: boolean = true;

    this.keydownFunction = function(event: any) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    }

    this.keyupFunction = function(event: any) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    }

    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  unbind(): void {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}