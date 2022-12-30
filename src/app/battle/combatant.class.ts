import { InteractivityChecker } from "@angular/cdk/a11y";

export class Combatant {
  battle;
  
  constructor(config: any, battle: any) {
    Object.keys(config).forEach(key => {
      this[key as keyof Combatant] = config[key];
    })
    this.battle = battle;
  }

  init(): void {

  }

  createElement(): void {

  }
}