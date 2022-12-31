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
    const { caster, target, damage, recover, status, action } = this.event;
    let who = this.event.onCaster ? caster : target;

    console.log('--- status:', status);


    // Modify the target to subtract HP damage
    if (damage) {
      target.update({
        hp: target.hp - damage,
      });

      // Start blinking animation
      target.pizzaElement.classList.add('battle-damage-blink');
    }

    // Modify the target to gain HP
    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({
        hp: newHp,
      });
    }

    // Modify the target status
    // Copying over the status object prevents passing it by reference & essentially 
    // clones it? This is useful since we don't want to modify the base status in the
    // shared Action variable in the shared/utils.ts file.
    if (status) {
      who.update({ status: { ...status } });
    }

    if (status === null) {
      who.update({ status: null });
    }

    // Pause, stop blinking, and resolve
    await wait(600);
    target.pizzaElement.classList.remove('battle-damage-blink');
    resolve();
  }

  submissionMenu(resolve: any): void {
    const { caster } = this.event;
    
    const menu = new SubmissionMenu({
      caster: caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter((c: any) => {
        return c.id !== caster.id && c.team === caster.team && c.hp > 0;
      }),
      onComplete: (submission: any) => {

        // The submission is what move to use & who to use it on, and is passed through
        // the following classes & methods: TurnCycle -> Battle -> BattleEvent -> init() -> 
        // submissionMenu()
        resolve(submission);
      },
    });
    menu.init(this.battle.element);

    console.log('--- menu.replacements:', menu.replacements);
  }

  animation(resolve: any) {
    const fn = BattleAnimations[this.event.animation as keyof typeof BattleAnimations];
    fn(this.event, resolve);
  }
}
