import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameObject } from 'src/app/classes/game-object.class';

@Component({
  selector: 'app-overworld',
  templateUrl: './overworld.component.html',
  styleUrls: ['./overworld.component.scss'],
})
export class OverworldComponent implements OnInit {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  raf: number | null = null;

  constructor(
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.canvas = document.getElementById("canvas-overworld") as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d");

    // Create background
    const image = new Image();
    image.onload = () => {
      this.ctx?.drawImage(image, 0, 0);
    }
    image.src = 'assets/overworld-map-01.svg';

    // Place some game objects
    const hero = new GameObject({
      x: 3,
      y: 3,
      src: null,
    });

    const npc1 = new GameObject({
      x: 5,
      y: 5,
      src: null,
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc1.sprite.draw(this.ctx);
    }, 500)
  }


}

 