export class Sprite {
  image;
  isLoaded: boolean = false;
  animations: any;
  gameObject: any;
  currentAnimation: string = '';
  currentAnimationFrame: number = 0;
  animationFrameLimit: number = 0;
  animationFrameProgress: number = 0;

  constructor(config: any) {

    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    // left is up
    // right is left
    // up is right
    // Configure animation & initial state
    this.animations = config.animations || {
      'idle-down':  [ [0, 0] ],
      'idle-left':  [ [0, 1] ],
      'idle-right': [ [0, 2] ],
      'idle-up':    [ [0, 3] ],
      'walk-down':  [ [1, 0], [0, 0], [3, 0], [0, 0] ],
      'walk-left':  [ [1, 1], [0, 1], [3, 1], [0, 1] ],
      'walk-right': [ [1, 2], [0, 2], [3, 2], [0, 2] ],
      'walk-up':    [ [1, 3], [0, 3], [3, 3], [0, 3] ],
    }
    this.currentAnimation = 'idle-left' // config.currentAnimation || 'idle-down';
    this.currentAnimationFrame = 0;
    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = 0;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: string) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  // Down-tick frame progress
  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;

    this.currentAnimationFrame += 1;
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraPerson: any) {
    const x = this.gameObject.x - 16 + (10.5 * 32) - cameraPerson.x;
    const y = this.gameObject.y - 32 + (9 * 32) - cameraPerson.y;

    // Create shadow image
    ctx.beginPath();
    ctx.arc(x, y + 18, 14, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0 , 0, 0.25)";
    ctx.fill();

    const [ frameX, frameY ] = this.frame;
    
    // Create character/npc image
    this.isLoaded && ctx.drawImage(
      this.image,
      frameX * 64,  // left anchor
      frameY * 64,  // top anchor
      64,           // width of cut
      64,           // height of cut
      x - 32,       // location on x-axis
      y - 32,       // location on y-axis
      64,           // size/scale along x-axis
      64            // size/scale along y-axis
    );

    this.updateAnimationProgress();
  }


}
