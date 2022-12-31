import { TextMessage } from "../classes/text-message.class";
import { SubmissionMenu } from "./submission-menu.class";
import { BattleAnimations, wait } from "../shared/utils";

export class BattleEvent {
  event;
  battle;

  constructor(event: any, battle: any) {
    this.event = event;
    this.battle = battle;
  }

  init(resolve: any): void {
    this[this.event.type as keyof BattleEvent](resolve);
  }

  textMessage(resolve: any): void {

    const text = this.event.text
      .replace('{CASTER}', this.event.caster?.name)
      .replace('{TARGET}', this.event.target?.name)
      .replace('{ACTION}', this.event.action?.name);
    
    const message = new TextMessage({
      text: text,
      onComplete: () => {
        resolve();
      },
    });
    message.init(this.battle.element);
  }

  async stateChange(resolve: any): Promise<any> {
    const { caster, target, damage, recover } = this.event;
    if (damage) {

      // Modify the target to subtract HP damage
      target.update({
        hp: target.hp - damage,
      });

      // Start blinking animation
      target.pizzaElement.classList.add('battle-damage-blink');
    }

    if (recover) {
      const who = this.event.onCaster ? caster : target;
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({
        hp: newHp,
      });
    }

    // Pause, stop blinking, and resolve
    await wait(600);
    target.pizzaElement.classList.remove('battle-damage-blink');
    resolve();
  }

  submissionMenu(resolve: any): void {
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

  animation(resolve: any) {
    const fn = BattleAnimations[this.event.animation as keyof typeof BattleAnimations];
    fn(this.event, resolve);
  }
}
