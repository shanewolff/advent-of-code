type MapEntry = {
  destinationRange: Array<number>;
  sourceRange: Array<number>;
};
type Map = Array<MapEntry>;

type Almanac = {
  source: Array<number>;
  maps: Array<Map>;
};

const decodeMap = (destination: number, source: number, length: number) =>
  ({
    destinationRange: [destination, destination + length - 1],
    sourceRange: [source, source + length - 1],
  }) as MapEntry;

const initializeAlmanac = async (): Promise<Almanac> => {
  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();
  const paragraphs = inputText.split("\n\n");
  const source = paragraphs[0]
    .match(/\d+/g)
    ?.map((matchedStr) => Number(matchedStr))!;
  const maps = paragraphs.slice(1).map(
    (mapStr) =>
      mapStr
        .split("\n")
        .slice(1)
        .map((line) => {
          const mapEntryValues = line.split(" ").map((str) => Number(str));
          return decodeMap(
            mapEntryValues[0],
            mapEntryValues[1],
            mapEntryValues[2],
          );
        }) as Map,
  );

  return {
    source,
    maps,
  };
};

const mapSourceToDestination = (source: Array<number>, map: Map) =>
  source.map((num) => {
    const eligibleMapEntry = map.filter(
      (mapEntry) =>
        num >= mapEntry.sourceRange[0]! && num <= mapEntry.sourceRange[1]!,
    )[0];

    if (!eligibleMapEntry) return num;

    return (
      eligibleMapEntry.destinationRange[0]! +
      (num - eligibleMapEntry.sourceRange[0]!)
    );
  });

const findDestination = (source: Array<number>, maps: Array<Map>) =>
  maps.reduce(
    (source, map) => mapSourceToDestination(source, map),
    [...source],
  );

function* decodeSource(source: Array<number>): Generator<number> {
  const evenIndices = Array.from(
    Array(source.length / 2).keys(),
    (key) => key * 2,
  );
  const array = evenIndices.map((index) => [source[index], source[index + 1]]);

  for (let pair of array) {
    let i = 0;
    while (i < pair[1]!) {
      yield pair[0]! + i;
      i++;
    }
  }
}

const main = async () => {
  console.log("-- Advent of Code 2023, Day-5 Puzzle --");

  const almanac = await initializeAlmanac();
  let destination = findDestination(almanac.source, almanac.maps);
  let lowestDestination = Math.min(...destination);
  console.log(`Lowest location number = ${lowestDestination}`);

  lowestDestination = Number.POSITIVE_INFINITY;
  for (const source of decodeSource(almanac.source)) {
    let destination = findDestination([source], almanac.maps);
    const currentLowestDestination = Math.min(...destination);
    if (currentLowestDestination < lowestDestination) {
      lowestDestination = currentLowestDestination;
    }
  }
  console.log(`Lowest location number with new source = ${lowestDestination}`);
};

export default main;
