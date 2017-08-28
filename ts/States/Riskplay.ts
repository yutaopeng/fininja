module BoilerPlate {
  export class Riskplay extends Phaser.State implements Fabrique.IState {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Riskplay.Name;
    public game: Fabrique.IGame;

    private background: Phaser.Image;
    private text: Label;
    private cancelBtn: LabeledButton;
    private wheel: Phaser.Sprite;
    private pin: Phaser.Sprite;
    private canSpin: boolean;

    constructor() {
      super();
    }

    public init(): void {
      this.game.world.removeAll();
    }

    public preload(): void {
      this.load.image('wheel', 'assets/images/wheel.png');
      this.load.image('pin', 'assets/images/pin.png');
    }

    public create(): void {
      super.create();

      //Send a screen view to Google to track different states
      // this.game.analytics.google.sendScreenView(this.name);

      this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_gameplay');

      this.text = new Label(this.game, 0, 0, 'Wheel of Fortune', {
        font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial',
        fill: '#ffffff'
      });
      let textStyle: any = { font: 'bold ' + 24 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF' };
      this.text.anchor.setTo(0.5);

      this.cancelBtn = new LabeledButton(this.game, 0, 0, 'CANCEL', textStyle, this.cancelGame, this, 150, 80);
      this.cancelBtn.createTexture(0xf98f25);

      this.wheel = this.game.add.sprite(0, 0, 'wheel');

      this.wheel.anchor.setTo(0.5, 0.5);
      // scale
      this.wheel.scale.setTo(0.8);
      // this.game.add.tween(this.wheel).to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Bounce.Out, true);
      let loadWheel: any = this.game.add.tween(this.wheel);
      loadWheel.to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Bounce.Out);
      loadWheel.onComplete.add(this.firstTween, this);
      loadWheel.start();
      this.pin = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pin');
      this.pin.anchor.set(0.5, 0.5);
      this.pin.scale.setTo(0.8);
      this.pin.alpha = 0;

      // the game has just started = we can spin the wheel

      // waiting for your input, then calling "spin" function
      // this.game.input.onDown.add(GameState.spin, this);

      // enable input on the sprite
      this.pin.inputEnabled = true;
      this.pin.events.onInputDown.add(this.spin, this);

      this.resize();
    }

    private cancelGame(): void {
      SoundManager.getInstance().play(Sounds.Click);
      this.game.state.add(Menu.Name, Menu, true);
    }

    private firstTween(): void {
      let loadPin: any = this.game.add.tween(this.pin).to({ alpha: 1 }, 1000, 'Linear', true);
      loadPin.onComplete.add(this.readySpin, this);
    }

    private readySpin(): void {
      this.canSpin = true;
    }

    private spin(): void {
      // can we spin the wheel?
      if (this.canSpin) {
        SoundManager.getInstance().play(Sounds.Click);
        // the wheel will spin round from 2 to 4 times. This is just coreography
        let rounds: number = this.game.rnd.between(2, 4);
        // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
        let degrees: number = this.game.rnd.between(0, 360);

        // now the wheel cannot spin because it's already spinning
        this.canSpin = false;
        // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
        // the quadratic easing will simulate friction
        let spinTween: any = this.game.add.tween(this.wheel).to({
          angle: 360 * rounds + degrees
        }, 5000, Phaser.Easing.Quadratic.Out, true);

        spinTween.onComplete.add(this.winPrize, this);
      }
    }

    private winPrize(): void {
      this.canSpin = true;
    }

    /**
     * Called every time the rotation or game size has changed.
     * Rescales and repositions the objects.
     */
    public resize(): void {
      this.background.width = this.game.width;
      this.background.height = this.game.height;

      this.wheel.alignIn(this.world.bounds, Phaser.CENTER);

      this.cancelBtn.x = 150;
      this.cancelBtn.y = this.game.height - 100;

      this.text.x = this.world.centerX;
      this.text.y = 80;

    }
  }
}
