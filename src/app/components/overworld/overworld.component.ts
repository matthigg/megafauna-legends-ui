import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameObject } from 'src/app/classes/game-object.class';
import { OverworldMap } from 'src/app/classes/overworld-map.class';
import { DirectionInput } from 'src/app/classes/direction-input.class';

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

  constructor(
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.canvas = document.getElementById("canvas-overworld") as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d");

    // Set map
    this.map = new OverworldMap(
      (<any>window).OverworldMaps.DemoRoom,
    );

    console.log('--- this.map.walls:', this.map.walls);

    this.directionInput.init();

    this.startGameLoop();
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
      Object.values(this.map?.gameObjects)?.forEach(object => {
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

 