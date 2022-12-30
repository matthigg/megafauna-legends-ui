export class Battle {
  element: any;

  constructor() {

  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.element);
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Battle');
    this.element.innerHTML = `
      <div class="Battle_hero">
        <img src="${'assets/character-01.webp'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${'assets/character-01.webp'}" alt="Enemy" />
      </div>
    `
  }
  
}