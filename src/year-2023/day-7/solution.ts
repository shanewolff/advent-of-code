const CARD_VALUE_STRENGTH = {
  "2": 1/14,
  "3": 2/14,
  "4": 3/14,
  "5": 4/14,
  "6": 5/14,
  "7": 6/14,
  "8": 7/14,
  "9": 8/14,
  T: 9/14,
  J: 10/14,
  Q: 11/14,
  K: 12/14,
  A: 13/14,
} as const;

type CardValue = keyof typeof CARD_VALUE_STRENGTH;

const HAND_TYPE_STRENGTH = {
  "5": 7,
  "41": 6,
  "32": 5,
  "311": 4,
  "221": 3,
  "2111": 2,
  "1111": 1,
} as const;

type HandType = keyof typeof HAND_TYPE_STRENGTH;

type HandInfo = {
  hand: Array<CardValue>;
  handType: HandType;
  bid: number;
};

const readInput = async (): Promise<Array<HandInfo>> => {
  const lines = (await Bun.file(import.meta.dir + "/input.txt").text()).split(
    "\n",
  );
  return lines.map((line): HandInfo => {
    const [hand, bidStr] = line.split(" ");
    const cards = Array.from(hand) as Array<CardValue>;
    return {
      hand: cards,
      handType: getHandType(cards),
      bid: Number(bidStr),
    };
  });
};

const getHandType = (hand: Array<CardValue>): HandType => {
  const cardCount: Record<string, number> = {};
  hand.forEach((card) => {
    if (cardCount.hasOwnProperty(card)) {
      cardCount[card] += 1;
    } else {
      cardCount[card] = 1;
    }
  });
  return Object.values(cardCount)
    .sort((value1, value2) => value2 - value1)
    .reduce((str, num) => str + num, String()) as HandType;
};

const sortHandsByStrength = (hands: Array<HandInfo>): Array<HandInfo> => {
  return hands.toSorted((handOne, handTwo) => {
    const rankDiff =
      HAND_TYPE_STRENGTH[handOne.handType] -
      HAND_TYPE_STRENGTH[handTwo.handType];
    if (handOne.handType !== handTwo.handType) {
      return rankDiff;
    }

    let i = 0;
    while (i < handOne.hand.length) {
      const strengthDiff =
        (CARD_VALUE_STRENGTH[handOne.hand[i]] -
          CARD_VALUE_STRENGTH[handTwo.hand[i]]) /
        Object.keys(CARD_VALUE_STRENGTH).length;
      if (handOne.hand[i] !== handTwo.hand[i]) {
        return rankDiff + strengthDiff;
      }
      i++;
    }

    return 0;
  });
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-6 Puzzle --");
  const handInfo = await readInput();
  const sortedHands = sortHandsByStrength(handInfo);
  const totalWinnings = sortedHands.reduce(
    (sum, hand, index) => sum + hand.bid * (index + 1),
    0,
  );
  console.log(sortedHands);
  console.log(`Total Winnings = ${totalWinnings}`);
};

export default main;
