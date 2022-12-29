export class RevealingText {
  element;
  text: string;
  speed: number;
  timeout: any = null;
  isDone: boolean;

  constructor(config: any) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 100;

    this.timeout = null;
    this.isDone = false;
  }

  init(): void {
    let characters: any[] = [];
    this.text.split('').forEach(character => {

      // Create an individual <span> for each character & add them all to the DOM
      let span = document.createElement('span');
      span.textContent = character;
      this.element.appendChild(span);

      // Add each <span> to our internal state, ie. the 'characters' array
      characters.push({
        span,
        delayAfter: character === ' ' ? 0 : this.speed,
      });
    });
    this.revealOneCharacter(characters);
  }

  revealOneCharacter(list: any[]): void {
    const next = list.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  // Reveal all characters instead of waiting for the 'type-writer' effect to finish
  warpToDone(): void {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll('span').forEach((span: any) => {
      span.classList.add('revealed');
    })
  }
}