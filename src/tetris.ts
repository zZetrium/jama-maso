export const WIDTH = 10;
export const HEIGHT = 20;

export enum Field {
  Empty = "EMPTY",
  Filled = "FILLED",
}

export class Game {
  fields: Field[][] = new Array(WIDTH).fill(false).map(() => new Array(HEIGHT).fill(Field.Empty));
  cur_piece: Field[][] = new Array(4).fill(false).map(() => new Array(4).fill(Field.Empty));
  cur_pos: [number, number] = [0, -1];

  constructor() {
    this.new_piece();
  }

  rand() {
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        this.fields[i][j] = Math.random() > 0.5 ? Field.Empty : Field.Filled;
      }
    }
  }

  collides(): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.cur_piece[i][j] == Field.Filled) {
          let field_at_pos = this.fields[this.cur_pos[0] + i][this.cur_pos[1] + j];
          if (field_at_pos == undefined || field_at_pos == Field.Filled) {
            return true;

          }
        }
        //console.log(this.fields[this.cur_pos[0] + i][this.cur_pos[1] + j]);
      }

    }
    return false;
  }

  new_piece() {
    for (let i = 0; i < 4; i++) {
      this.cur_piece[i].fill(Field.Empty);
    }
    // todo
    switch (Math.round(Math.random() * 5) % 5) {
      case 0: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 1: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[3][2] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 2: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[1][3] = Field.Filled;
        this.cur_piece[1][0] = Field.Filled;
        break;
      }
      case 3: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][0] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 4: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[3][1] = Field.Filled;
        this.cur_piece[2][1] = Field.Filled;
        this.cur_piece[2][2] = Field.Filled;
        break;
      }
      case 5: {
        this.cur_piece[1][1] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        this.cur_piece[1][3] = Field.Filled;
        this.cur_piece[1][2] = Field.Filled;
        break;
      }

    }
  }

  place() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.cur_piece[i][j] == Field.Filled) {
          this.fields[this.cur_pos[0] + i][this.cur_pos[1] + j] = Field.Filled;
        }
      }
    }
  }

  tick() {
    this.cur_pos[1] += 1;
    if (this.collides()) {
      this.cur_pos[1] -= 1;
      this.place();
      this.cur_pos = [0, -1];
      this.new_piece();
    }
  }
}





