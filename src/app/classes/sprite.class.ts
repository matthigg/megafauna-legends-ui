export class Sprite {
  image;
  isLoaded: boolean = false;
  animations: any;
  gameObject: any;
  currentAnimation: string = '';
  currentAnimationFrame: number = 0;

  constructor(config: any) {

    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // Configure animation & initial state
    this.animations = config.animations || {
      idleDown: [
        [0, 0]
      ]
    }
    this.currentAnimation = config.currentAnimation || 'idleDown';
    this.currentAnimationFrame = 0;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  draw(ctx: any) {
    const x = this.gameObject.x * 32 - 16;
    const y = this.gameObject.y * 32 - 32;

    // Create shadow image
    ctx.beginPath();
    ctx.arc(x - 1, y + 18, 14, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0 , 0, 0.25)";
    ctx.fill();
    
    // Create character/npc image
    this.isLoaded && ctx.drawImage(
      this.image,
      0,            // left anchor
      0,            // top anchor
      64,           // width of cut
      64,           // height of cut
      x - 32,       // location on x-axis
      y - 32,       // location on y-axis
      64,           // size/scale along x-axis
      64            // size/scale along y-axis
    );


  }
}
