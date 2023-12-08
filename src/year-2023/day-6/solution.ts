type GameData = {
  time: number;
  distance: number;
};

const extractGameData = async (removeSpace: boolean = false) => {
  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();
  const data = inputText.split("\n").map((str) => {
    if (removeSpace) {
      str = str.replaceAll(" ", "");
    }
    return str.match(/\d+/g)?.map((strNum) => Number(strNum))!;
  });
  return data[0].map(
    (time, index) =>
      ({
        time,
        distance: data[1][index],
      }) as GameData,
  );
};

const findWaysToBeat = (gameData: GameData) => {
  const lowerBound = Math.ceil(
    (gameData.time -
      Math.sqrt(Math.pow(gameData.time, 2) - 4 * gameData.distance)) /
      2,
  );
  const upperBound = Math.floor(
    (gameData.time +
      Math.sqrt(Math.pow(gameData.time, 2) - 4 * gameData.distance)) /
      2,
  );
  return upperBound - lowerBound + 1;
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-6 Puzzle --");
  let gamesData = await extractGameData();
  let waysToBeat = gamesData.map(findWaysToBeat);
  const productOfWaysToBeat = waysToBeat.reduce(
    (product, num) => product * num,
    1,
  );
  console.log(
    `The product of the number of ways to win the games = ${productOfWaysToBeat}`,
  );
  gamesData = await extractGameData(true);
  waysToBeat = gamesData.map(findWaysToBeat);
  console.log(
    `The number of ways to win the kern-adjusted game = ${waysToBeat}`,
  );
};

export default main;
