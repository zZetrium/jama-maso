export const WIDTH = 10;
export const HEIGHT = 20;

export enum Field {
  Empty = "EMPTY",
  Filled = "FILLED",
}

export class Game {
  fields: Field[][] = new Array(WIDTH).fill(false).map(() => new Array(HEIGHT).fill(Field.Empty));
  cur_piece: Field[][] = new Array(4).fill(false).map(() => new Array(4).fill(Field.Empty));
  
}





