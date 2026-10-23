import { Application, Assets, Graphics, Matrix, Texture } from "pixi.js";
import { HEIGHT, WIDTH } from "./tetris";

const is_key_down = (() => {
  const state: Record<string, boolean> = {};

  window.addEventListener('keyup', (e) => state[e.key] = false);
  window.addEventListener('keydown', (e) => state[e.key] = true);

  return (key: string) => state.hasOwnProperty(key) && state[key] || false;
})();

async function init() {

  const app = new Application();

  await app.init({
    resizeTo: window,   // 👈 key line
    background: "#1d1d1d",
  });
  document.body.style.margin = "0";


  document.body.appendChild(app.canvas);

  // Simple test object
  const circle = new Graphics()
    .circle(0, 0, 50)
    .fill("red");


  circle.x = 400;
  circle.y = 300;

  //app.stage.addChild(circle);
  /*let speed = 2.5;
  // animation loop
  app.ticker.add(() => {
    if (is_key_down("a")) {
       circle.x -= speed;
    }
    if (is_key_down("d")) {
       circle.x += speed;
    }
    if (is_key_down("s")) {
       circle.y += speed;
    }
    if (is_key_down("w")) {
       circle.y -= speed;
    }
  });*/

  let size = 10;

  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      let field = new Graphics()
        .rect(i * size, j * size, size, size)
        .stroke({
          width: 2,
          color: 0xffffff
        })
        .fill({
        color: 0xffffff,
        alpha: 0.5,
        texture: await Assets.load("https://static.wikia.nocookie.net/portalworldsgame/images/e/e7/Concrete_Block_2x2.png/revision/latest?cb=20190610131137"),
        matrix: new Matrix()
    });
    app.stage.addChild(field);
    }
  }

  //const gameMap = new Graphics();
  app.ticker.add(() => {

  });
}

init();