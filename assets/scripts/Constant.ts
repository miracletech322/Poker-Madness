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
  newCards?: CardObject[];
  handCards?: CardObject[];
  scoreLevel?: number[];
}

export interface CardObject {
  id: number;
  symbol: string;
  value: number;
  cardFlower: CardFlower;
  flowerId: number;
  background: string;
  cardStatus?: CardStatus;
}

export enum CardFlower {
  Spade,
  Heart,
  Cube,
  Diamond,
}

export enum CardStatus {
  Initial,
  Pick,
  Pop,
}

export enum GameStartOption {
  NewRun,
  Continue,
  Challenge,
}

export const max_round: number = 5;
export const maxCardForOneRow = 8;
export const gameSpeed = 1;

export const cardPopDistance = 30;

export enum ScoreTypes {
  StraightFlush, //0
  FourOfAKind, // 1
  FullHouse, // 2
  Flush, // 3
  Straight, // 4
  ThreeOfAKind, // 5
  TwoPair, // 6
  Pair, // 7
  HighCard, // 8
}

export const scoreRule = {
  // five cards in a row and same suit
  [ScoreTypes.StraightFlush]: [
    {
      multi1: 100,
      multi2: 8,
    },
  ],
  // four cards with a same rank
  [ScoreTypes.FourOfAKind]: [
    {
      multi1: 60,
      multi2: 7,
    },
  ],
  // three of kind and a pair
  [ScoreTypes.FullHouse]: [
    {
      multi1: 40,
      multi2: 4,
    },
  ],
  // five cards with same suit
  [ScoreTypes.Flush]: [
    {
      multi1: 35,
      multi2: 4,
    },
  ],
  // five cards in a row
  [ScoreTypes.Straight]: [
    {
      multi1: 30,
      multi2: 4,
    },
  ],
  // three cards with a same rank
  [ScoreTypes.ThreeOfAKind]: [
    {
      multi1: 30,
      multi2: 3,
    },
  ],
  // two pairs
  [ScoreTypes.TwoPair]: [
    {
      multi1: 20,
      multi2: 2,
    },
  ],
  // one pair
  [ScoreTypes.Pair]: [
    {
      multi1: 10,
      multi2: 2,
    },
  ],
  [ScoreTypes.HighCard]: [
    {
      multi1: 100,
      multi2: 8,
    },
  ],
};
