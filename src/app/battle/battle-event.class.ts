import { InteractivityChecker } from "@angular/cdk/a11y";
import { TextMessage } from "../classes/text-message.class";

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
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => {
        resolve();
      },
    });
    message.init(this.battle.element);
  }
}