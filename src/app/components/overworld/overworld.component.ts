import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameObject } from 'src/app/classes/game-object.class';
import { OverworldMap } from 'src/app/classes/overworld-map.class';
import { DirectionInput } from 'src/app/classes/direction-input.class';
import { KeyPressListener } from 'src/app/classes/key-press-listener.class';
import { Hud } from 'src/app/classes/hud.class';

@Component({
  selector: 'app-overworld',
  templateUrl: './overworld.component.html',
  styleUrls: ['./overworld.component.scss'],
})
export class OverworldComponent implements OnInit {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  raf: number | null = null;
  map: any = null;
  directionInput: DirectionInput = new DirectionInput();
  hud: any;

  constructor(
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.canvas = document.getElementById("canvas-overworld") as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d");

    this.hud = new Hud();
    this.hud.init(document.querySelector('.game-container'));
    
    this.startMap((<any>window).OverworldMaps.DemoRoom);
    
    this.bindActionInput();
    this.bindHeroPosition();
    
    this.directionInput.init();
    this.startGameLoop();
    
    // this.map.startCutscene([
    //   { type: 'battle', enemyId: 'beth' }
    //   // { type: 'changeMap', map: "DemoRoom" },
    //   // { type: 'textMessage', text: 'This is the very first message!'},
    // ]);
  }

  // Set map here to expose it to the overworld-event class in order to load different maps
  startMap(mapConfig: any) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  bindActionInput(): void {
    new KeyPressListener('Enter', () => {

      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPosition(): void {
    document.addEventListener('PersonWalkingComplete', (e: any) => {

      // Check if hero's position has changed
      if (e.detail.whoId === 'hero') {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startGameLoop(): void {
    const step = () => {
      if (this.canvas) {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // Establish the 'camera' person
      const cameraPerson = this.map.gameObjects.hero;

      // Update all objects
      Object.values(this.map?.gameObjects)?.forEach(object => {
        (object as any).update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw lower map layer
      this.map.drawLowerImage(this.ctx, cameraPerson)

      // Draw game objects
      Object.values(this.map?.gameObjects)
        ?.sort((a: any, b: any) => { return a.y - b.y })
        .forEach(object => {
          (object as any).sprite.draw(this.ctx, cameraPerson);
        });

      // Draw upper map layer
      this.map.drawUpperImage(this.ctx, cameraPerson)
      
      requestAnimationFrame(() => {
        step();
      })
    } 
    step();
  }
}

 