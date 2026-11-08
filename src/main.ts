//import { Application, Assets, Graphics, Matrix, Texture } from "pixi.js";
import { Field, Game, HEIGHT, WIDTH } from "./tetris";

const TEAMS_NAMES = ["Hovězí", "Kuřecí", "Vepřové", "Jehněčí"];

const is_key_down = (() => {
  const state: Record<string, boolean> = {};

  window.addEventListener('keyup', (e) => state[e.key] = false);
  window.addEventListener('keydown', (e) => state[e.key] = true);

  return (key: string) => state.hasOwnProperty(key) && state[key] || false;
})();

const TEAM_COUNT = 4;
const UPDATE_INTERVAL = 10;
const TICK_INTERVAL = 600;

async function init() {
  document.body.style.margin = "0";
  let updates: ((game: Game) => void)[] = [];
  for (let index = 0; index < TEAM_COUNT; index++) {
    let { element: element, update: update } = createDisplay(TEAMS_NAMES[index]);
    document.querySelector("#root")?.appendChild(element);
    updates.push(update);
  }

  let games: Game[] = [];
  for (let i = 0; i < TEAM_COUNT; i++) {
    games.push(new Game());
  }
  let tick_counter = 0;
  setInterval(() => {
    tick_counter += UPDATE_INTERVAL;
    /*while (tick_counter >= TICK_INTERVAL) {
      tick_counter -= TICK_INTERVAL;
      games[i].tick();
    }*/
    let tick_count = Math.floor(tick_counter / TICK_INTERVAL);
    tick_counter %= TICK_INTERVAL;
    for (let i = 0; i < TEAM_COUNT; i++) {
      for (let j = 0; j < tick_count; j++) {
        games[i].tick();
      }
      updates[i](games[i]);
    }
  }, UPDATE_INTERVAL);
  window.addEventListener("keydown", (e) => {
    for (let i = 0; i < TEAM_COUNT; i++) {
      if (e.key == "a") {
        games[i].move_left();
      }

      if (e.key == "d") {
        games[i].move_right();
      }
      if (e.key == "s") {
        games[i].move_down();
      }

      if (e.key == "q") {
        games[i].rotate_cw();
      }

      if (e.key == "e") {
        games[i].rotate_ccw();
      }

    }
  });
}

type TetrisDisplay = {
  element: HTMLElement;
  update: (game: Game) => void;
}

function triangleWave(x: number, period: number, offset: number = 0): number {
  return 2 * Math.abs(x / period + offset - Math.floor(x / period + offset + 0.5));
}

function createDisplay(team_name: string): TetrisDisplay {
  let display = document.createElement("div");
  display.classList.add("display");

  let name = document.createElement("div");
  name.innerHTML = team_name;
  name.classList.add("name");
  display.appendChild(name);

  let actions = document.createElement("div");
  actions.innerHTML = "uninit";
  actions.classList.add("score");
  display.appendChild(actions);

  let score = document.createElement("div");
  score.innerHTML = "uninit";
  score.classList.add("score");
  display.appendChild(score);

  let grid = document.createElement("table");
  grid.classList.add("board");
  display.appendChild(grid);

  let fieldList: HTMLElement[] = [];

  for (let i = 0; i < HEIGHT; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < WIDTH; j++) {
      let field = document.createElement("td");
      let fill = document.createElement("div");
      fill.classList.add("fill");
      fieldList.push(fill);
      let clr = "#" + Math.round(Math.random() * 0xffffff).toString(16);
      //console.log(clr);
      fill.style.backgroundColor = clr;
      field.appendChild(fill);
      row.appendChild(field);
    }
    grid.appendChild(row);
  }

  return {
    element: display,
    update: (() => {
      let update_counter = 0;
      let roff = Math.random();
      let goff = Math.random();
      let boff = Math.random();


      return ((game: Game) => {
        actions.innerHTML = "akce: " + game.actions.toString();
        score.innerHTML = "skóre: " + game.score.toString();

        update_counter += UPDATE_INTERVAL;
        for (let i = 0; i < WIDTH; i++) {
          for (let j = 0; j < HEIGHT; j++) {

            fieldList[i + j * WIDTH].style.backgroundColor =
              (i - game.cur_x < 4 && i - game.cur_x >= 0
                && j - game.cur_y < 4 && j - game.cur_y >= 0
                && game.cur_piece[i - game.cur_x][j - game.cur_y] == Field.Filled)
                ? floatsToRgb(
                  0.9 + triangleWave(update_counter, 4000, roff * i / WIDTH) * 0.1,
                  triangleWave(update_counter, 4000, goff * j / HEIGHT) * 0.4,
                  triangleWave(update_counter, 6000, boff) * 0.4
                )
                : game.fields[i][j] == Field.Empty
                  ? "#000000"
                  : floatsToRgb(
                    0.3 + triangleWave(update_counter, 4000, roff * i / WIDTH) * 0.4,
                    0.3 + triangleWave(update_counter, 4000, goff * j / HEIGHT) * 0.7,
                    0.5 + triangleWave(update_counter, 6000, boff) * 0.5
                  );
          }
        }
      })
    })()
  };
}

function floatsToRgb(r: number, g: number, b: number): string {
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  return `rgb(${red}, ${green}, ${blue})`;
}

init();