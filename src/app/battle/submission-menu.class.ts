import { Actions } from "../shared/utils";

export class SubmissionMenu {
  caster;
  enemy;
  onComplete;

  constructor({ caster, enemy, onComplete }: any) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  // This method simulates an enemy decision -- in a larger game, this probably would exist
  // on something like an enemy object. The 'target' can be anyone -- an actual enemy, a 
  // teammate, your character, etc.
  decide() {
    this.onComplete({
      action: Actions[this.caster.actions[0] as keyof typeof Actions],
      target: this.enemy,
    });
  }

  init(container: any) {
    this.decide();
  }
}