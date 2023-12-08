const extractNumbers = (str: string, startIndex: number, endIndex?: number) =>
  Array.from(str.slice(startIndex, endIndex).matchAll(/\d+/g), (regexMatch) =>
    Number(regexMatch[0]),
  );

type CardDetails = {
  winningNums: Array<number>;
  ownNums: Array<number>;
  matchCount?: number;
  copyCount?: number;
};

const extractCardDetails = (cardStr: string): CardDetails => {
  const colonIndex = cardStr.indexOf(":");
  const pipeIndex = cardStr.indexOf("|");
  return {
    winningNums: extractNumbers(cardStr, colonIndex + 1, pipeIndex),
    ownNums: extractNumbers(cardStr, pipeIndex + 1),
    copyCount: 1,
  };
};

const findCardMatches = (card: CardDetails) =>
  card.ownNums.reduce((matchCount, ownNum) => {
    if (card.winningNums.includes(ownNum)) ++matchCount;
    return matchCount;
  }, 0);

const initializeCardTable = async () => {
  const cardTable: Array<CardDetails> = [];
  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();
  for await (const line of inputText.split("\n")) {
    const card = extractCardDetails(line);
    card.matchCount = findCardMatches(card);
    cardTable.push(card);
  }
  return cardTable;
};

const findTotalPoints = (cardTable: Array<CardDetails>) =>
  cardTable.reduce((totalPoints, card) => {
    if (card.matchCount !== 0) totalPoints += Math.pow(2, card.matchCount! - 1);
    return totalPoints;
  }, 0);

const findTotalCards = (cardTable: Array<CardDetails>) => {
  cardTable.forEach((card, index) => {
    if (card.matchCount === 0) return;
    const start = index + 1;
    const end = start + card.matchCount!;
    const copies = card.copyCount!;
    cardTable.slice(start, end).forEach((card) => {
      card.copyCount! += copies;
    });
  });
  return cardTable.reduce(
    (totalCards, card) => totalCards + card.copyCount!,
    0,
  );
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-4 Puzzle --");

  const cardTable = await initializeCardTable();
  const totalPoints = findTotalPoints(cardTable);

  console.log(`Total points of the scratchcard winnings = ${totalPoints}`);

  const totalCards = findTotalCards(cardTable);
  console.log(`Total scratch cards on the table = ${totalCards}`);
};

export default main;
