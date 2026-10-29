//import { Application, Assets, Graphics, Matrix, Texture } from "pixi.js";
import { Field, Game, HEIGHT, WIDTH } from "./tetris";

const is_key_down = (() => {
  const state: Record<string, boolean> = {};

  window.addEventListener('keyup', (e) => state[e.key] = false);
  window.addEventListener('keydown', (e) => state[e.key] = true);

  return (key: string) => state.hasOwnProperty(key) && state[key] || false;
})();

const TEAM_COUNT = 4;

async function init() {
  document.body.style.margin = "0";
  let updates: ((game: Game) => void)[] = [];
  for (let index = 0; index < TEAM_COUNT; index++) {
    let { element: element, update: update } = createDisplay();
    document.querySelector("#root")?.appendChild(element);
    updates.push(update);
  }

  let games: Game[] = [];
  for (let i = 0; i < TEAM_COUNT; i++) {
    games.push(new Game());
  }
  setInterval(() => {
    for (let i = 0; i < TEAM_COUNT; i++) {
      if(is_key_down("a")) {
        games[i].move_left();
      }
       if(is_key_down("d")) {
        games[i].move_right();
      }
      games[i].tick();
      updates[i](games[i]);
    }
  }, 200);
}

type TetrisDisplay = {
  element: HTMLElement;
  update: (game: Game) => void;
}

function createDisplay(): TetrisDisplay {
  let grid = document.createElement("table");
  grid.classList.add("board");
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
    element: grid,
    update: game => {
      for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
          /* if (i - game.cur_pos[0] < 4 && i - game.cur_pos[0] >= 0
             && j - game.cur_pos[1] < 4 && j - game.cur_pos[1] >= 0
           ) {
             fieldList[j + i * HEIGHT].style.backgroundColor = "#ffff00";
           } else {
             fieldList[j + i * HEIGHT].style.backgroundColor = game.fields[i][j] == Field.Empty ? "#000000" : "#ffffff";
           }*/
          fieldList[i + j * WIDTH].style.backgroundColor =
            (i - game.cur_pos[0] < 4 && i - game.cur_pos[0] >= 0
               && j - game.cur_pos[1] < 4 && j - game.cur_pos[1] >= 0 
               && game.cur_piece[i - game.cur_pos[0]][j - game.cur_pos[1]]==Field.Filled)
              ? "#ffff00"
              : game.fields[i][j] == Field.Empty
                ? "#000000"
                : "#ffffff";
          //"rgb("+i*20+","+j*10+","+(i*j)+")";
          //console.log("rgb("+i+","+j+")");
        }
      }
    }
  };
}

init();