//import { Application, Assets, Graphics, Matrix, Texture } from "pixi.js";
import { Field, Game, HEIGHT, WIDTH } from "./tetris";

const TEAMS_NAMES = ["Hovězí", "Kuřecí", "Vepřové", "Jehněčí","Skopové"];

const is_key_down = (() => {
  const state: Record<string, boolean> = {};

  window.addEventListener('keyup', (e) => state[e.key] = false);
  window.addEventListener('keydown', (e) => state[e.key] = true);

  return (key: string) => state.hasOwnProperty(key) && state[key] || false;
})();

let TEAM_COUNT = 4;
const UPDATE_INTERVAL = 100;
let server = "";
async function init() {
  server = window.prompt("server") ?? "";
  document.body.style.margin = "0";
  TEAM_COUNT = parseInt(await (await fetch(`${server}`, {
      method: "PUT"
    })).text());
  let updates: ((game: Game) => void)[] = [];
  for (let index = 0; index < TEAM_COUNT; index++) {
    let { element: element, update: update } = await createDisplay(TEAMS_NAMES[index]);
    document.querySelector("#root")?.appendChild(element);
    updates.push(update);
  }

  let games: Game[] = [];
  for (let i = 0; i < TEAM_COUNT; i++) {
    games.push(new Game());
  }
  setInterval(async () => {
    /*while (tick_counter >= TICK_INTERVAL) {
      tick_counter -= TICK_INTERVAL;
      games[i].tick();
    }*/
    for (let i = 0; i < TEAM_COUNT; i++) {
      //games[i].tick();
      games[i] = await fetch(`${server}?game_id=${i}`).then((response) => response.text()).then(JSON.parse);

      updates[i](games[i]);
    }
  }, UPDATE_INTERVAL);
  window.addEventListener("keydown", async (e) => {
    for (let i = 0; i < TEAM_COUNT; i++) {
      if (e.key == "a") {
        await fetch(`${server}?game_id=${i}&action=left`, {
          method: "POST"
        });
      }

      if (e.key == "d") {
        await fetch(`${server}?game_id=${i}&action=right`, {
          method: "POST"
        });
      }
      if (e.key == "s") {
        await fetch(`${server}?game_id=${i}&action=down`, {
          method: "POST"
        });
      }

      if (e.key == "q") {
        await fetch(`${server}?game_id=${i}&action=rotcw`, {
          method: "POST"
        });
      }

      if (e.key == "e") {
        await fetch(`${server}?game_id=${i}&action=rotccw`, {
          method: "POST"
        });
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

async function createDisplay(team_name: string): Promise<TetrisDisplay> {
  let display = document.createElement("div");
  display.classList.add("display");

  let name = document.createElement("div");
  name.innerHTML = team_name;
  // name.innerHTML = await fetch("${server}hello?keyword=World").then((response) => response.text());

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