import "./style.css";

const PLAYER_SIZE = 80;
const COLORS = {
  GREEN: "green",
  RED: "red",
  BLUE: "blue",
  YELLOW: "yellow",
} as const;

interface GameState {
  playerX: number;
  playerY: number;
  playerColor: string;
  velocity: number;
  controllerIndex: number | null;
  leftPressed: boolean;
  rightPressed: boolean;
  upPressed: boolean;
  downPressed: boolean;
}

class Game {
  private canvas = document.getElementById("canvas") as HTMLCanvasElement;
  private ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private state: GameState;

  constructor() {
    this.state = {
      playerX: 0,
      playerY: 0,
      playerColor: "#F231A5",
      velocity: 0,
      controllerIndex: null,
      leftPressed: false,
      rightPressed: false,
      upPressed: false,
      downPressed: false,
    };

    this.setupEventListeners();
    this.setupCanvas();
    this.gameLoop();
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => this.setupCanvas());
    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      this.state.controllerIndex = event.gamepad.index;
      console.log("connected");
    });
    window.addEventListener("gamepaddisconnected", () => {
      console.log("disconnected");
      this.state.controllerIndex = null;
    });
  }

  private controllerInput() {
    if (this.state.controllerIndex === null) return;

    const gamepad = navigator.getGamepads()[this.state.controllerIndex];
    if (!gamepad) return;

    const { buttons, axes } = gamepad;
    const stickDeadZone = 0.4;

    // Movement controls
    this.state.upPressed = buttons[12].pressed || axes[1] <= -stickDeadZone;
    this.state.downPressed = buttons[13].pressed || axes[1] >= stickDeadZone;
    this.state.leftPressed = buttons[14].pressed || axes[0] <= -stickDeadZone;
    this.state.rightPressed = buttons[15].pressed || axes[0] >= stickDeadZone;

    // Color controls
    if (buttons[0].pressed) this.state.playerColor = COLORS.GREEN;
    else if (buttons[1].pressed) this.state.playerColor = COLORS.RED;
    else if (buttons[2].pressed) this.state.playerColor = COLORS.BLUE;
    else if (buttons[3].pressed) this.state.playerColor = COLORS.YELLOW;
  }

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.state.velocity = this.canvas.width * 0.01;

    this.state.playerX = (this.canvas.width - PLAYER_SIZE) / 2;
    this.state.playerY = (this.canvas.height - PLAYER_SIZE) / 2;
  }

  private clearScreen() {
    this.ctx.fillStyle = "#0a0c21";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawPlayer() {
    this.ctx.fillStyle = this.state.playerColor;
    this.ctx.fillRect(
      this.state.playerX,
      this.state.playerY,
      PLAYER_SIZE,
      PLAYER_SIZE
    );
  }

  private movePlayer() {
    const { velocity } = this.state;
    if (this.state.upPressed) this.state.playerY -= velocity;
    if (this.state.downPressed) this.state.playerY += velocity;
    if (this.state.leftPressed) this.state.playerX -= velocity;
    if (this.state.rightPressed) this.state.playerX += velocity;
  }

  private gameLoop() {
    this.clearScreen();
    this.drawPlayer();
    this.controllerInput();
    this.movePlayer();
    requestAnimationFrame(() => this.gameLoop());
  }
}

new Game();
