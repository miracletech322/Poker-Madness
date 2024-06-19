// export class Constant {
//   public static gameStartOption: {
//     NewRun: 0;
//     Continue: 1;
//     Challenge: 2;
//   };
// }

export interface GameSetting {
  gameStart?: boolean;
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
  remainHandCardsCount?: number;
  newCards?: Card[];
  handCards?: Card[];
}

export interface Card {
  id: number;
  symbol: string;
  value: number;
  cardFlower: CardFlower;
  flowerId: number;
}

export enum CardFlower {
  Spade,
  Heart,
  Cube,
  Diamond,
}

export enum GameStartOption {
  NewRun,
  Continue,
  Challenge,
}

export const max_round: number = 5;
export const maxCardForOneRow = 8;
