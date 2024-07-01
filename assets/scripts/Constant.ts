// export class Constant {
//   public static gameStartOption: {
//     NewRun: 0;
//     Continue: 1;
//     Challenge: 2;
//   };
// }

export interface GameSetting {
  gameStart?: boolean;
  round?: number;
  maxCountForHandCards?: number;
  gameProgress?: GameProgress;
  totalCardCount?: number;
  remainCardCount?: number;
  score?: number;
  reachingScore?: number;
  multi1?: number;
  multi2?: number;
  scoreType?: ScoreTypes | null;
  hands?: number;
  discards?: number;
  cash?: number;
  ante?: number;
  totalAnte?: number;
  newCards?: CardObject[];
  handCards?: CardObject[];
  scoreLevel?: number[];
  sortType?: number;
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

export interface Blind {
  id: number;
  type: BlindType;
  name: string;
  description: string;
  minimumAnte: number;
  scoreAtLeast: number;
  toEarn: number;
}

export interface Ante {
  level: number;
  baseChip: number;
  baseChipAtGreenStake: number;
  baseChipAtPurpleStake: number;
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

export enum RoundFinishTypes {
  None,
  Failed,
  Success,
}

export enum SortTypes {
  Rank,
  Suit,
  None,
}

export enum GameProgress {
  Init,
  FillingCard,
  Poping,
  PlayingHand,
  Dragging,
}

export enum Direction {
  Left,
  Right,
}

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

export enum BlindType {
  SmallBlind,
  BigBlind,
  BossBlind,
  FinisherBossBlind,
}

export const max_round: number = 5;
export const gameSpeed = 1;

export const cardPopDistance = 30;
export const spacingForCard = 60;
export const roundScore = [300, 500, 700];

export const suitName = {
  [CardFlower.Spade]: "Spades",
  [CardFlower.Heart]: "Hearts",
  [CardFlower.Cube]: "Cubes",
  [CardFlower.Diamond]: "Diamonds",
};

export const suitColor = {
  [CardFlower.Spade]: "#291c7f",
  [CardFlower.Heart]: "#ef164f",
  [CardFlower.Cube]: "#3b4245",
  [CardFlower.Diamond]: "#df5424",
};

export const scoreRule = {
  // five cards in a row and same suit
  [ScoreTypes.StraightFlush]: [
    {
      multi1: 100,
      multi2: 8,
      name: "Straight Flush",
      size: 20,
    },
  ],
  // four cards with a same rank
  [ScoreTypes.FourOfAKind]: [
    {
      multi1: 60,
      multi2: 7,
      name: "Four of a Kind",
      size: 20,
    },
  ],
  // three of kind and a pair
  [ScoreTypes.FullHouse]: [
    {
      multi1: 40,
      multi2: 4,
      name: "Full House",
      size: 24,
    },
  ],
  // five cards with same suit
  [ScoreTypes.Flush]: [
    {
      multi1: 35,
      multi2: 4,
      name: "Flush",
      size: 30,
    },
  ],
  // five cards in a row
  [ScoreTypes.Straight]: [
    {
      multi1: 30,
      multi2: 4,
      name: "Straight",
      size: 30,
    },
  ],
  // three cards with a same rank
  [ScoreTypes.ThreeOfAKind]: [
    {
      multi1: 30,
      multi2: 3,
      name: "Three of a Kind",
      size: 20,
    },
  ],
  // two pairs
  [ScoreTypes.TwoPair]: [
    {
      multi1: 20,
      multi2: 2,
      name: "Two Pair",
      size: 30,
    },
  ],
  // one pair
  [ScoreTypes.Pair]: [
    {
      multi1: 10,
      multi2: 2,
      name: "Pair",
      size: 30,
    },
  ],
  [ScoreTypes.HighCard]: [
    {
      multi1: 5,
      multi2: 1,
      name: "High Card",
      size: 24,
    },
  ],
};

export const blinds: Blind[] = [
  {
    id: 0,
    type: BlindType.SmallBlind,
    name: "Small Blind",
    description: "No special effects - can be skipped to receive a Tag",
    minimumAnte: 1,
    scoreAtLeast: 1,
    toEarn: 3,
  },
  {
    id: 1,
    type: BlindType.BigBlind,
    name: "Big Blind",
    description: "No special effects - can be skipped to receive a Tag",
    minimumAnte: 1,
    scoreAtLeast: 1.5,
    toEarn: 4,
  },
  {
    id: 2,
    type: BlindType.BossBlind,
    name: "The Hook",
    description:
      "Discards 2 random cards from your hand, after each hand played",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 3,
    type: BlindType.BossBlind,
    name: "The 0x",
    description: "Playing your most played hand this run sets money to $0",
    minimumAnte: 6,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 4,
    type: BlindType.BossBlind,
    name: "The House",
    description: "First hand is drawn face down",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 5,
    type: BlindType.BossBlind,
    name: "The Wall",
    description: "Extra large blind",
    minimumAnte: 2,
    scoreAtLeast: 4,
    toEarn: 5,
  },
  {
    id: 6,
    type: BlindType.BossBlind,
    name: "The Wheel",
    description: "1 in 7 cards get drawn face-down throughout the round",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 7,
    type: BlindType.BossBlind,
    name: "The Arm",
    description:
      "Decreases the level of Hand you play by 1 (hand levels can go to Level 1, and are permanently reduced before scoring)",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 8,
    type: BlindType.BossBlind,
    name: "The Club",
    description: "All Club cards are debuffed",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 9,
    type: BlindType.BossBlind,
    name: "The Fish",
    description: "Cards are drawn face down after each hand played",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 10,
    type: BlindType.BossBlind,
    name: "The Psychic",
    description: "Must play 5 cards(they do not need to be scoring)",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 11,
    type: BlindType.BossBlind,
    name: "The Goad",
    description: "All spade cards are debuffed",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 12,
    type: BlindType.BossBlind,
    name: "The Water",
    description: "Start with 0 discards",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 13,
    type: BlindType.BossBlind,
    name: "The Window",
    description: "All Diamond cards are debuffed",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 14,
    type: BlindType.BossBlind,
    name: "The Manacle",
    description: "-1 Hand Size",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 15,
    type: BlindType.BossBlind,
    name: "The Eye",
    description:
      "Every hand played this round must be of a different type and not previously played this round",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 16,
    type: BlindType.BossBlind,
    name: "The Mouth",
    description: "Only one hand type can be played this round",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 17,
    type: BlindType.BossBlind,
    name: "The Plant",
    description: "All face cards are debuffed",
    minimumAnte: 4,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 18,
    type: BlindType.BossBlind,
    name: "The Serpent",
    description:
      "After playing a hand or discarding cards, you always draw 3 cards(hand size is ignored)",
    minimumAnte: 5,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 19,
    type: BlindType.BossBlind,
    name: "The Pillar",
    description:
      "Cards played previously this Ante(during Small and Big Blinds) are debuffed",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 20,
    type: BlindType.BossBlind,
    name: "The Needle",
    description: "Play only 1 hand",
    minimumAnte: 2,
    scoreAtLeast: 1,
    toEarn: 5,
  },
  {
    id: 21,
    type: BlindType.BossBlind,
    name: "The Head",
    description: "All Heart cards are debuffed",
    minimumAnte: 1,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 22,
    type: BlindType.BossBlind,
    name: "The Tooth",
    description: "Lose $1 per card played",
    minimumAnte: 3,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 23,
    type: BlindType.BossBlind,
    name: "The Flint",
    description:
      "The base Chips and Mult for playing a poker hand are halved this round",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 24,
    type: BlindType.BossBlind,
    name: "The Mark",
    description: "All face cards are drawn face down",
    minimumAnte: 2,
    scoreAtLeast: 2,
    toEarn: 5,
  },
  {
    id: 25,
    type: BlindType.FinisherBossBlind,
    name: "Amber Acorn",
    description: "Flips and shuffles all Joker cards",
    minimumAnte: 8,
    scoreAtLeast: 2,
    toEarn: 8,
  },
  {
    id: 26,
    type: BlindType.FinisherBossBlind,
    name: "Verdant Leaf",
    description: "All cards debuffed until 1 Joker sold",
    minimumAnte: 8,
    scoreAtLeast: 2,
    toEarn: 8,
  },
  {
    id: 27,
    type: BlindType.FinisherBossBlind,
    name: "Violet Vessel",
    description: "Very large blind",
    minimumAnte: 8,
    scoreAtLeast: 6,
    toEarn: 8,
  },
  {
    id: 28,
    type: BlindType.FinisherBossBlind,
    name: "Crimson Heart",
    description: "One random Joker disabled every hand(changes every hand)",
    minimumAnte: 8,
    scoreAtLeast: 2,
    toEarn: 8,
  },
  {
    id: 29,
    type: BlindType.FinisherBossBlind,
    name: "Cerulean Bell",
    description: "Forces 1 card to always be selected",
    minimumAnte: 8,
    scoreAtLeast: 2,
    toEarn: 8,
  },
];

export const antes: Ante[] = [
  {
    level: 0,
    baseChip: 100,
    baseChipAtGreenStake: 100,
    baseChipAtPurpleStake: 100,
  },
  {
    level: 1,
    baseChip: 300,
    baseChipAtGreenStake: 300,
    baseChipAtPurpleStake: 300,
  },
  {
    level: 2,
    baseChip: 800,
    baseChipAtGreenStake: 900,
    baseChipAtPurpleStake: 1000,
  },
  {
    level: 3,
    baseChip: 2000,
    baseChipAtGreenStake: 2600,
    baseChipAtPurpleStake: 3200,
  },
  {
    level: 4,
    baseChip: 5000,
    baseChipAtGreenStake: 8000,
    baseChipAtPurpleStake: 9000,
  },
  {
    level: 5,
    baseChip: 11000,
    baseChipAtGreenStake: 20000,
    baseChipAtPurpleStake: 25000,
  },
  {
    level: 6,
    baseChip: 20000,
    baseChipAtGreenStake: 36000,
    baseChipAtPurpleStake: 60000,
  },
  {
    level: 7,
    baseChip: 35000,
    baseChipAtGreenStake: 60000,
    baseChipAtPurpleStake: 110000,
  },
  {
    level: 8,
    baseChip: 50000,
    baseChipAtGreenStake: 100000,
    baseChipAtPurpleStake: 200000,
  },
  {
    level: 9,
    baseChip: 110000,
    baseChipAtGreenStake: 230000,
    baseChipAtPurpleStake: 460000,
  },
  {
    level: 10,
    baseChip: 560000,
    baseChipAtGreenStake: 1100000,
    baseChipAtPurpleStake: 2200000,
  },
  {
    level: 11,
    baseChip: 7200000,
    baseChipAtGreenStake: 14000000,
    baseChipAtPurpleStake: 29000000,
  },
  {
    level: 12,
    baseChip: 300000000,
    baseChipAtGreenStake: 600000000,
    baseChipAtPurpleStake: 1200000000,
  },
  {
    level: 13,
    baseChip: 47000000000,
    baseChipAtGreenStake: 94000000000,
    baseChipAtPurpleStake: 1.8e11,
  },
  {
    level: 14,
    baseChip: 2.9e13,
    baseChipAtGreenStake: 5.8e13,
    baseChipAtPurpleStake: 1.1e14,
  },
  {
    level: 15,
    baseChip: 7.7e16,
    baseChipAtGreenStake: 1.5e17,
    baseChipAtPurpleStake: 3.0e17,
  },
  {
    level: 16,
    baseChip: 8.6e20,
    baseChipAtGreenStake: 1.7e21,
    baseChipAtPurpleStake: 3.4e21,
  },
  {
    level: 17,
    baseChip: 4.2e25,
    baseChipAtGreenStake: 8.4e25,
    baseChipAtPurpleStake: 1.6e26,
  },
  {
    level: 18,
    baseChip: 9.2e30,
    baseChipAtGreenStake: 1.8e31,
    baseChipAtPurpleStake: 3.7e31,
  },
  {
    level: 19,
    baseChip: 9.2e36,
    baseChipAtGreenStake: 1.8e37,
    baseChipAtPurpleStake: 3.7e37,
  },
  {
    level: 20,
    baseChip: 4.3e43,
    baseChipAtGreenStake: 8.6e43,
    baseChipAtPurpleStake: 1.7e44,
  },
  {
    level: 21,
    baseChip: 9.7e50,
    baseChipAtGreenStake: 1.9e51,
    baseChipAtPurpleStake: 3.8e51,
  },
  {
    level: 22,
    baseChip: 1.0e59,
    baseChipAtGreenStake: 2.1e59,
    baseChipAtPurpleStake: 4.2e59,
  },
  {
    level: 23,
    baseChip: 5.8e67,
    baseChipAtGreenStake: 1.1e68,
    baseChipAtPurpleStake: 2.3e68,
  },
  {
    level: 24,
    baseChip: 1.6e77,
    baseChipAtGreenStake: 3.3e77,
    baseChipAtPurpleStake: 6.6e77,
  },
];
