import { InteractivityChecker } from "@angular/cdk/a11y";

export class BattleEvent {
  event;
  battle;

  constructor(event: any, battle: any) {
    this.event = event;
    this.battle = battle;
  }

  init(resolve: any) {
    this[this.event.type as keyof BattleEvent](resolve);
  }

  textMessage(resolve: any) {
    console.log('--- a message:');

  }
}