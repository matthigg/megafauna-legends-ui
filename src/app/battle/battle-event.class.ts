import { TextMessage } from "../classes/text-message.class";
import { SubmissionMenu } from "./submission-menu.class";

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

  submissionMenu(resolve: any) {
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      onComplete: (submission: any) => {

        // The submission is what move to use & who to use it on, and is passed through
        // the following classes & methods: TurnCycle -> Battle -> BattleEvent -> init() -> 
        // submissionMenu()
        resolve(submission);
      },
    });
    menu.init(this.battle.element);
  }
}