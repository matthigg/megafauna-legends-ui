export class TurnCycle {
  battle: any;
  onNewEvent;
  currentTeam;

  constructor({ battle, onNewEvent }: any) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.currentTeam = 'player'; // can be 'player' or 'enemy'
  }

  async init() {

    // This message immediately fires off when a battle first starts, ie. when the battle
    // class calls init() via this.turnCycle.init()
    // await this.onNewEvent({
    //   type: 'textMessage',
    //   text: 'The battle is starting!',
    // });

    // Start the first turn!
    this.turn();
  }

  async turn() {

    // Caster - this is a reference to whose turn it is
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[caster.team === 'player' ? 'enemy' : 'player'];
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: 'submissionMenu', 
      caster,
      enemy,
    });

    // Stop here if we are replacing the pizza
    if (submission.replacement) {
      await this.onNewEvent({
        type: 'replace',
        replacement: submission.replacement
      });
      await this.onNewEvent({
        type: 'textMessage',
        text: `Go get them, ${submission.replacement.name}!`
      });
      this.nextTurn();
      return;
    }

    // The instsanceId references the unique id of an item that has been used and needs to be
    // removed from the player or enemy inventory
    if (submission.instanceId) {
      this.battle.items = this.battle.items
        .filter((item: any) => item.instanceId !== submission.instanceId);
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    // Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: 'textMessage', text: `${submission.target.name} is ruined!`,
      });

      if (submission.target.team === 'enemy') {
        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.giveXp();

        await this.onNewEvent({
          type: 'textMessage',
          text: `Gained ${xp} XP!`,
        });

        await this.onNewEvent({
          type: 'giveXp',
          xp,
          combatant: this.battle.combatants[playerActivePizzaId],
        });
      }
    }

    // Do we have a winning team?
    const winner = this.getWinningTeam();
    
    // END THE BATTLE
    if (winner) {
      await this.onNewEvent({
        type: 'textMessage', text: 'Winner!'
      });
      return;
    }

    // We have a dead target, but still no winner, so bring in a replacement
    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: 'replacementMenu',
        team: submission.target.team,
      });

      await this.onNewEvent({
        type: 'replace',
        replacement: replacement,
      });

      await this.onNewEvent({
        type: 'textMessage',
        text: `${replacement.name} appears!`,
      });
    };

    // Check for post-events, ie. status effects, that need to occur -after- the original 
    // turn submission
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    // Check if a status has expired
    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }
    this.nextTurn();
  }

  // Change teams from 'player' to 'enemy' & vice-versa once all of the events have 
  // completed
  nextTurn(): void {
    this.currentTeam = this.currentTeam === 'player' ? 'enemy' : 'player';
    this.turn();
  }

  getWinningTeam(): string | null {
    let aliveTeams: any = {};
    Object.values(this.battle.combatants).forEach((c: any) => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    });
    if(!aliveTeams['player']) { return 'enemy' }
    if(!aliveTeams['enemy']) { return 'player' }
    return null;
  }
  
}
