import { randomFromArray } from "../shared/utils";

export class Combatant {
  battle;
  hudElement: any;
  id: any;
  team: any;
  name: any;
  icon: any;
  src: any;
  type: any;
  level: any;
  hp: any;
  maxHp: any;
  hpFills: any;
  xp: any;
  maxXp: any;
  xpFills: any;
  pizzaElement: any;
  status: any;
  
  constructor(config: any, battle: any) {
    Object.keys(config).forEach(key => {
      this[key as keyof Combatant] = config[key];
    })
    this.battle = battle;
  }

  init(container: any): void {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.pizzaElement);
    this.update();
  }

  createElement(): void {
    this.hudElement = document.createElement('div');
    this.hudElement.classList.add('Combatant');
    this.hudElement.setAttribute('data-combatant', this.id);
    this.hudElement.setAttribute('data-team', this.team);
    this.hudElement.innerHTML = (`
      <p class="Combatant_name">${this.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 26 3" class="Combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" class="Combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
      </svg>
      <p class="Combatant_status"></p>
    `);
    this.pizzaElement = document.createElement('img');
    this.pizzaElement.classList.add('Pizza');
    this.pizzaElement.setAttribute('src', this.src);
    this.pizzaElement.setAttribute('alt', this.name);
    this.pizzaElement.setAttribute('data-team', this.team);

    this.hpFills = this.hudElement.querySelectorAll('.Combatant_life-container > rect');
    this.xpFills = this.hudElement.querySelectorAll('.Combatant_xp-container > rect');
  }

  update(changes: any = {}): void {

    // Apply any incoming changes in order to update the HUD
    Object.keys(changes).forEach(key => {
      this[key as keyof Combatant] = changes[key];
    });

    // Update the isActive flag to display the correct HUD & pizza
    this.hudElement.setAttribute('data-active', this.isActive());
    this.pizzaElement.setAttribute('data-active', this.isActive());
    
    // Display pizza HP & XP Bars
    this.hpFills.forEach((rect: any) => {
      rect.style.width = `${this.hpPercent()}%`;
    });
    this.xpFills.forEach((rect: any) => {
      rect.style.width = `${this.xpPercent()}%`;
    });

    // Display pizza Level
    this.hudElement.querySelector('.Combatant_level').innerText = this.level;

    // Update status
    const statusElement = this.hudElement.querySelector('.Combatant_status');
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = 'block';
    } else {
      statusElement.innerText = '';
      statusElement.style.display = 'none';
    }
  }

  hpPercent(): number {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  xpPercent(): number {
    return this.xp / this.maxXp * 100;
  }

  isActive(): boolean {
    return this.battle.activeCombatants[this.team] === this.id;
  }

  getReplacedEvents(originalEvents: any): any {
    if (this.status?.type === 'Clumsy' && randomFromArray([true, false, false])) {
      return [
        { type: 'textMessage', text: `${this.name} flops over!` },
      ];
    }

    return originalEvents;
  }

  getPostEvents(): any[] {
    if (this.status?.type === 'Saucy') {
      return [
        { type: 'textMessage', text: 'Feeling saucy!' },
        { type: 'stateChange', recover: 5, onCaster: true },
      ]
    }
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({ status: null });
        return { type: 'textMessage', text: `Status expired!` }
      }
    }
    return null;
  }
}
