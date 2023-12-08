type CubeSet = {
  red: number;
  green: number;
  blue: number;
};

const gameConfig: CubeSet = {
  red: 12,
  green: 13,
  blue: 14,
};

type GameInfo = {
  gameId: number;
  cubeSets: Array<CubeSet>;
};

type ExtractGameInfo = (details: string) => GameInfo;

const extractGameInfo: ExtractGameInfo = (details) => {
  const splittedDetails = details.split(/: |; /g);
  const gameId = Number(splittedDetails.at(0)?.match(/\d+/g));
  const cubeSets = splittedDetails.slice(1).map(
    (reveleadDetails: string): CubeSet => ({
      red: Number(reveleadDetails.match(/\d+(?= red)/g)),
      green: Number(reveleadDetails.match(/\d+(?= green)/g)),
      blue: Number(reveleadDetails.match(/\d+(?= blue)/g)),
    }),
  );
  return { gameId, cubeSets };
};

type CheckGamePossibility = (
  gameInfo: GameInfo,
  gameConfig: CubeSet,
) => boolean;

const checkGamePossibility: CheckGamePossibility = (gameInfo, gameConfig) => {
  for (const cubeSet of gameInfo.cubeSets) {
    for (const color of Object.keys(cubeSet) as Array<keyof typeof cubeSet>) {
      if (cubeSet[color] > gameConfig[color]) {
        return false;
      }
    }
  }
  return true;
};

type FindMinimumPossibleGameConfig = (gameInfo: GameInfo) => CubeSet;

const findMinimumPossibleConfig: FindMinimumPossibleGameConfig = (gameInfo) => {
  const maxCubesUsed: CubeSet = {
    red: 0,
    green: 0,
    blue: 0,
  };

  gameInfo.cubeSets.forEach((cubeSet) => {
    (Object.keys(cubeSet) as Array<keyof typeof cubeSet>).forEach((color) => {
      if (cubeSet[color] > maxCubesUsed[color]) {
        maxCubesUsed[color] = cubeSet[color];
      }
    });
  });

  return maxCubesUsed;
};

type FindPowerOfCubeSet = (cubeSet: CubeSet) => number;

const findPowerOfCubeSet: FindPowerOfCubeSet = (cubeSet) => {
  return Object.values(cubeSet).reduce(
    (previousValue, currentValue) => previousValue * currentValue,
    1,
  );
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-2 Puzzle --");

  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();
  let gameIdSum = 0,
    minPossibleCubeSetPowerSum = 0;

  for (const line of inputText.split("\n")) {
    const gameInfo = extractGameInfo(line);
    if (checkGamePossibility(gameInfo, gameConfig)) {
      gameIdSum += gameInfo.gameId;
    }
    minPossibleCubeSetPowerSum += findPowerOfCubeSet(
      findMinimumPossibleConfig(gameInfo),
    );
  }
  console.log(`Sum of possible game IDs = ${gameIdSum}`);
  console.log(
    `Sum of minimum possible cube set powers = ${minPossibleCubeSetPowerSum}`,
  );
};

export default main;
