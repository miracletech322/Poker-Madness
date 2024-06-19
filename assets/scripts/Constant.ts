// export class Constant {
//   public static gameStartOption: {
//     NewRun: 0;
//     Continue: 1;
//     Challenge: 2;
//   };
// }

export interface GameSetting {
  totalCardCount?: number;
  remainCardCount?: number;
  score?: number;
  multi1?: number;
  multi2?: number;
  hands?: number;
  discards?: number;
  cash?: number;
  ante?: number;
  totalAnte?: number;
}

export enum GameStartOption {
  NewRun,
  Continue,
  Challenge,
}

export const max_round: number = 5;
